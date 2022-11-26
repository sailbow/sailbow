using Ardalis.GuardClauses;

using AutoMapper;

using Microsoft.AspNetCore.Authorization;

using Sb.Api.Authorization;
using Sb.Api.Models;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;
using Sb.OAuth2;

namespace Sb.Api.Services
{
    public class BoatService
    {
        private readonly IRepository _repo;
        private readonly HttpContext _context;
        private readonly IAuthorizationService _authService;
        private readonly IMapper _mapper;

        public BoatService(
            IRepository repo,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authService,
            IMapper mapper)
        {
            _repo = repo;
            _context = contextAccessor.HttpContext;
            _authService = authService;
            _mapper = mapper;
        }

        public async Task<Boat> CreateBoat(Boat boat)
        {
            Guard.Against.Null(boat, nameof(boat));
            Boat inserted = await _repo.InsertAsync(boat);
            return inserted;
        }

        public async Task<BoatDto> GetBoatById(string boatId)
        {
            Boat boat = await GetBoat(boatId);
            var readAuthResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.ReadBoatPolicy);
            Guard.Against.Forbidden(readAuthResult);

            var captainAuthResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.CaptainPolicy);
            boat.Show = captainAuthResult.Succeeded;

            BoatDto b = _mapper.Map<Boat, BoatDto>(boat);

            b.Modules = await _repo.GetAsync<Module>(m => m.BoatId == boatId);
            b.Role = b.Crew
                .First(cm => cm.UserId == _context.GetUserId())
                .Role;

            return b;
        }

        public async Task<IEnumerable<Boat>> GetAllBoats(string userId)
        {
            return await _repo.GetAsync<Boat>(b => b.Crew.Any(cm => cm.UserId == userId));
        }

        public async Task<IEnumerable<Boat>> GetBoats(string userId, int? page, int? perPage, string search = "")
        {
            User user = await _repo.GetByIdAsync<User>(userId);
            Guard.Against.EntityMissing(user, nameof(user));

            return await _repo.GetPaginatedAsync<Boat>(
                skip: page.GetValueOrDefault(0),
                take: perPage.GetValueOrDefault(10),
                predicate: b =>
                    b.Crew.Any(cm => cm.UserId == userId) &&
                    (search == string.Empty || b.Name.Contains(search)));
        }

        public async Task<Code> GenerateCodeInvite(string boatId, int? expiresUnix)
        {
            Boat boat = await GetBoat(boatId);

            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            DateTimeOffset offset = expiresUnix.HasValue
                ? DateTimeOffset.FromUnixTimeSeconds(expiresUnix.Value)
                : DateTimeOffset.UtcNow;

            Code code = new()
            {
                Value = Guid.NewGuid().ToString(),
                ExpiresAt = offset.UtcDateTime
            };
            boat.Code = code;
            await _repo.UpdateAsync(boat);
            return code;
        }

        public async Task<Code> GetCodeInvite(string boatId)
        {
            Boat boat = await GetBoat(boatId);
            Guard.Against.EntityMissing(boat.Code, nameof(boat.Code));
            return boat.Code;
        }


        public async Task<Boat> AcceptCodeInvite(string boatId, string code)
        {
            Boat boat = await GetBoat(boatId);
            Guard.Against.EntityMissing(boat.Code, nameof(boat.Code));

            AuthorizedUser user = _context.GetUserFromClaims();
            if (boat.Crew.Any(cm => cm.UserId == user.Id))
                throw new ConflictException();

            if (boat.Code.Value != code)
                throw new ValidationException("Code has expired or is invalid");

            boat.Crew = boat.Crew.Append(new CrewMember
            {
                UserId = user.Id,
                Email = user.Email,
                Role = Role.Sailor
            });
            await _repo.UpdateAsync(boat);
            return boat;
        }

        public async Task<Boat> AddCrewMember(string boatId, CrewMember crewMember)
        {
            Guard.Against.Null(crewMember, nameof(crewMember));
            Guard.Against.NullOrWhiteSpace(crewMember.UserId, nameof(crewMember.UserId));

            Boat boat = await GetBoat(boatId);

            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            if (!boat.Crew.Any(member => member.UserId == crewMember.UserId))
            {
                User user = await _repo.GetByIdAsync<User>(crewMember.UserId);
                Guard.Against.EntityMissing(user, nameof(user));
                boat.Crew = boat.Crew.Append(crewMember);
                await _repo.UpdateAsync(boat);
            }
            return boat;
        }

        public async Task DeleteCrewMember(string boatId, string userId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));

            Boat boat = await _repo.GetByIdAsync<Boat>(boatId);
            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.CaptainPolicy);
            Guard.Against.Forbidden(authResult);

            if (boat != null)
            {
                boat.Crew = boat.Crew.Where(cm => cm.UserId != userId);
                await _repo.UpdateAsync(boat);
            }
        }

        public async Task<IEnumerable<Invite>> CreateInvites(string boatId, IEnumerable<Invite> invites)
        {
            Guard.Against.Null(invites, nameof(invites));
            Boat boat = await GetBoat(boatId);
            var authResult = await _authService.AuthorizeAsync(_context.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            var existingInvites = await _repo.GetAsync<Invite>(i => i.BoatId == boatId);
            var newInvites = invites
                .Where((i) => !existingInvites.Any(ei => ei.BoatId == i.BoatId));
            List<Invite> created = new();
            foreach (var invite in newInvites)
            {
                invite.InviterId = _context.GetUserFromClaims().Id;
                invite.BoatId = boatId;
                created.Add(await _repo.InsertAsync(invite));
            }

            return created;
        }

        public async Task<InviteDetails> GetInviteById(string boatId, string inviteId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.NullOrWhiteSpace(inviteId, nameof(inviteId));
            Invite invite = await _repo.GetByIdAsync<Invite>(inviteId);
            Guard.Against.EntityMissing(invite, nameof(invite));
            Boat boat = await _repo.GetByIdAsync<Boat>(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));
            CrewMember captain = boat.Crew.First(cm => cm.Role == Role.Captain);
            User captainUserData = await _repo.GetByIdAsync<User>(captain.UserId);
            return new InviteDetails
            {
                Id = inviteId,
                BoatName = boat.Name,
                Banner = boat.Banner,
                Captain = new CrewMemberWithUserInfo
                {
                    UserId = captain.UserId,
                    Name = captainUserData.Name,
                    Role = captain.Role
                }
            };
        }

        public async Task AcceptBoatInvite(string boatId, string inviteId, string email)
        {
            Guard.Against.NullOrWhiteSpace(inviteId, nameof(inviteId));

            Boat boat = await GetBoat(boatId);

            if (boat.Crew.Any(cm => cm.Email == email))
                throw new ConflictException();

            Invite invite = await _repo.GetByIdAsync<Invite>(inviteId);
            Guard.Against.EntityMissing(invite, nameof(invite));
            if (invite.Email != email) throw new ForbiddenResourceException();

            boat.Crew = boat.Crew.Append(new CrewMember
            {
                UserId = _context.GetClaim(CustomClaimTypes.Id),
                Role = invite.Role,
                Info = string.Empty,
                Email = email
            });

            await _repo.UpdateAsync(boat);
            await _repo.DeleteAsync(invite);
        }

        public async Task<IEnumerable<Invite>> GetPendingInvites(string boatId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            return await _repo.GetAsync<Invite>(i => i.BoatId == boatId);
        }

        private async Task<Boat> GetBoat(string boatId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Boat boat = await _repo.GetByIdAsync<Boat>(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));
            return boat;
        }
    }
}
