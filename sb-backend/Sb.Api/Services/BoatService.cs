using System.Linq;

using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Authorization;

using Sb.Api.Authorization;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Services
{
    public class BoatService
    {
        private readonly IRepository<Boat> _boatRepo;
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Invite> _inviteRepo;
        private readonly HttpContext _context;
        private readonly IAuthorizationService _authService;

        public BoatService(
            IRepository<Boat> boatRepo,
            IRepository<User> userRepo,
            IRepository<Invite> inviteRepo,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authService)
        {
            _boatRepo = boatRepo;
            _userRepo = userRepo;
            _inviteRepo = inviteRepo;
            _context = contextAccessor.HttpContext;
            _authService = authService;
        }

        public async Task<Boat> CreateBoat(Boat boat)
        {
            Guard.Against.Null(boat, nameof(boat));
            Boat inserted = await _boatRepo.InsertAsync(boat);
            return inserted;
        }

        public async Task<Boat> GetBoatById(string boatId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));
            var readAuthResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.ReadBoatPolicy);
            Guard.Against.Forbidden(readAuthResult);

            var captainAuthResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.CaptainPolicy);
            boat.Show = captainAuthResult.Succeeded;
            return boat;
        }

        public async Task<IEnumerable<Boat>> GetBoatsByUserId(string userId)
        {
            User user = await _userRepo.GetByIdAsync(userId);
            Guard.Against.EntityMissing(user, nameof(user));

            return await _boatRepo.GetAsync(b => b.Crew.Any(cm => cm.UserId == userId));
        }

        public async Task<Boat> AddCrewMember(string boatId, CrewMember crewMember)
        {
            Guard.Against.Null(crewMember, nameof(crewMember));
            Guard.Against.NullOrWhiteSpace(crewMember.UserId, nameof(crewMember.UserId));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));

            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            if (!boat.Crew.Any(member => member.UserId == crewMember.UserId))
            {
                User user = await _userRepo.GetByIdAsync(crewMember.UserId);
                Guard.Against.EntityMissing(user, nameof(user));
                boat.Crew = boat.Crew.Append(crewMember);
                await _boatRepo.UpdateAsync(boat);
            }
            return boat;
        }

        public async Task DeleteCrewMember(string boatId, string userId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.CaptainPolicy);
            Guard.Against.Forbidden(authResult);

            if (boat != null)
            {
                boat.Crew = boat.Crew.Where(cm => cm.UserId != userId);
                await _boatRepo.UpdateAsync(boat);
            }
        }

        public async Task<IEnumerable<Invite>> CreateInvites(string boatId, IEnumerable<Invite> invites)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.Null(invites, nameof(invites));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            var existingInvites = await _inviteRepo.GetAsync(i => i.BoatId == boatId);
            var newInvites = invites
                .Where((i) => !existingInvites.Any(ei => ei.BoatId == i.BoatId));
            List<Invite> created = new();
            foreach (var invite in newInvites)
            {
                invite.InviterId = _context.GetUserFromClaims().Id;
                invite.BoatId = boatId;
                created.Add(await _inviteRepo.InsertAsync(invite));
            }

            return created;
        }

        public async Task AcceptBoatInvite(string boatId, string inviteId, string email)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.NullOrWhiteSpace(inviteId, nameof(inviteId));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));

            if (boat.Crew.Any(cm => cm.Email == email))
                throw new ConflictException();

            Invite invite = await _inviteRepo.GetByIdAsync(inviteId);
            Guard.Against.EntityMissing(invite, nameof(invite));
            if (invite.Email != email) throw new ForbiddenResourceException();
            
            boat.Crew = boat.Crew.Append(new CrewMember
            {
                UserId = _context.GetClaim(CustomClaimTypes.Id),
                Role = invite.Role,
                Info = string.Empty,
                Email = email
            });

            await _boatRepo.UpdateAsync(boat);
            await _inviteRepo.DeleteAsync(invite);
        }

        public async Task<IEnumerable<Invite>> GetPendingInvites(string boatId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            return await _inviteRepo.GetAsync(i => i.BoatId == boatId);
        }
    }
}
