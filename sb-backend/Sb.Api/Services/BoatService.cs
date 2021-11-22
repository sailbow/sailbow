using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Authorization;

using Sb.Api.Authorization;
using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Services
{
    public class BoatService
    {
        private readonly IRepository<Boat> _boatRepo;
        private readonly IRepository<User> _userRepo;
        private readonly HttpContext _context;
        private readonly IAuthorizationService _authService;

        public BoatService(
            IRepository<Boat> boatRepo,
            IRepository<User> userRepo,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authService)
        {
            _boatRepo = boatRepo;
            _userRepo = userRepo;
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
            var readAuthResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.ReadBoatPolicy);
            Guard.Against.Forbidden(readAuthResult);

            var captainAuthResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.CaptainPolicy);
            boat.Show = captainAuthResult.Succeeded;
            return boat;
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

        public async Task<IEnumerable<Invite>> AddCrewInvites(string boatId, IEnumerable<string> emails)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.Null(emails, nameof(emails));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            foreach (string email in emails)
            {
                if (!boat.Invites.Any(i => i.Email == email))
                {
                    boat.Invites = boat.Invites.Append(new Invite { Email = email });
                }
            }
            await _boatRepo.UpdateAsync(boat);
            return boat.Invites.Where(i => emails.Contains(i.Email));
        }
    }
}
