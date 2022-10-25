using System.Security.Claims;

using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Mvc;

using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    public class BoatsController : ApiControllerBase
    {
        private readonly BoatService _boatService;
        private readonly EmailService _emailService;
        private readonly IRepository _repo;

        public BoatsController(
            BoatService boatService,
            EmailService emailService,
            IRepository repo)
        {
            _boatService = boatService;
            _emailService = emailService;
            _repo = repo;
        }

        [HttpPost]
        public async Task<Boat> CreateBoat(
            [FromBody] Boat boat,
            [FromQuery] bool generateCode = false,
            [FromQuery] int? codeExpiresUnix = null)
        {
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            Guard.Against.NullOrWhiteSpace(id, nameof(id));

            var invitees = boat.Crew.Where(cm => cm.Email != HttpContext.GetClaim(ClaimTypes.Email));
            boat.Crew = new List<CrewMember>
            {
                new CrewMember
                {
                    UserId = id,
                    Role = Role.Captain,
                    Info = string.Empty
                }
            };
            boat = await _boatService.CreateBoat(boat);
            if (generateCode)
                boat.Code = await _boatService.GenerateCodeInvite(boat.Id, codeExpiresUnix);

            await SendBoatInvites(boat.Id, invitees.Select(invitee => new Invite
            {
                BoatId = boat.Id,
                Email = invitee.Email,
                Role = invitee.Role
            }));

            return boat;
        }

        [HttpGet]
        public Task<IEnumerable<Boat>> GetBoats([FromQuery] GetBoatsRequest request)
        {
            return _boatService.GetBoats(HttpContext.GetClaim(CustomClaimTypes.Id), request);
        }

        [HttpGet("{boatId}")]
        public async Task<BoatWithUserRole> GetBoatById(string boatId)
        {
            BoatWithUserRole boat = (BoatWithUserRole)(await _boatService.GetBoatById(boatId));
            boat.Role = boat.Crew
                .First(cm => cm.UserId == HttpContext.GetClaim(CustomClaimTypes.Id))
                .Role;

            return boat;
        }

        [HttpPut("{boatId}/code")]
        public async Task<ActionResult<Code>> GenerateCodeInvite(string boatId, [FromQuery] int? expiresUnix)
        {
            Code code = await _boatService.GenerateCodeInvite(boatId, expiresUnix);
            return Ok(code);
        }

        [HttpGet("{boatId}/code")]
        public async Task<ActionResult<Code>> GetCodeInvite(string boatId)
        {
            Code code = await _boatService.GetCodeInvite(boatId);
            return Ok(code);
        }

        [HttpPost("{boatId}/code/accept")]
        public async Task<ActionResult<Boat>> AcceptCodeInvite(string boatId, [FromQuery] string code)
        {
            Boat boat = await _boatService.AcceptCodeInvite(boatId, code);
            return Ok(boat);
        }

        [HttpGet("{boatId}/invites")]
        public async Task<ActionResult<IEnumerable<Invite>>> GetInvites(string boatId)
        {
            // Perform read validation but don't need the result
            await _boatService.GetBoatById(boatId);
            var invites = await _repo.GetAsync<Invite>(i => i.BoatId == boatId);
            return Ok(invites);
        }

        [HttpGet("{boatId}/invites/{inviteId}")]
        public async Task<ActionResult<InviteDetails>> GetInvite(string boatId, string inviteId)
        {
            InviteDetails invite = await _boatService.GetInviteById(boatId, inviteId);
            return Ok(invite);
        }

        [HttpPost("{boatId}/invites")]
        public async Task<IActionResult> SendBoatInvites(string boatId, [FromBody] IEnumerable<Invite> invites)
        {
            var newInvites = await _boatService.CreateInvites(boatId, invites);
            await _emailService.SendBoatInvitations(boatId, newInvites);
            return Ok();
        }

        [HttpPost("{boatId}/invites/{inviteId}/accept")]
        public async Task<ActionResult<Boat>> AcceptInvite(string boatId, string inviteId)
        {
            await _boatService.AcceptBoatInvite(boatId, inviteId, HttpContext.GetClaim(ClaimTypes.Email));
            Boat boat = await _boatService.GetBoatById(boatId);
            return Ok(boat);

        }

        [HttpPost("{boatId}/crew")]
        public Task<Boat> AddCrewMember(string boatId, [FromBody] CrewMember crewMember)
            => _boatService.AddCrewMember(boatId, crewMember);

        [HttpGet("{boatId}/crew")]
        public async Task<IEnumerable<CrewMemberWithUserInfo>> GetCrew(string boatId)
        {
            Boat boat = await _boatService.GetBoatById(boatId);
            var crewUserIds = boat.Crew.Select(c => c.UserId);
            IEnumerable<User> users = await _repo
                .GetAsync<User>(u => crewUserIds.Contains(u.Id));

            List<CrewMemberWithUserInfo> crew = new();
            foreach (var user in users)
            {
                CrewMember cm = boat.Crew.First(u => u.UserId == user.Id);
                crew.Add(new CrewMemberWithUserInfo
                {
                    UserId = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Role = cm.Role,
                    Info = cm.Info
                });
            }
            return crew;
        }

        [HttpDelete("{boatId}/crew/{userId}")]
        public async Task<IActionResult> DeleteCrewMember(string boatId, string userId)
        {
            await _boatService.DeleteCrewMember(boatId, userId);
            return Ok();
        }
    }
}