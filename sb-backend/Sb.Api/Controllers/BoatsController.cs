using System.Security.Claims;

using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    [Authorize]
    public class BoatsController : ApiControllerBase
    {
        private readonly BoatService _boatService;
        private readonly EmailService _emailService;
        private readonly SbContext _db;

        public BoatsController(
            BoatService boatService,
            EmailService emailService,
            SbContext db)
        {
            _boatService = boatService;
            _emailService = emailService;
            _db = db;
        }

        [HttpPost]
        public async Task<Boat> CreateBoat(
            [FromBody] Boat boat,
            [FromQuery] bool generateCode = false,
            [FromQuery] int? codeExpiresUnix = null)
        {
            Guid id = HttpContext.GetUserId().GetValueOrDefault();

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

            //await SendBoatInvites(boat.Id, invitees.Select(invitee => new Invite
            //{
            //    BoatId = boat.Id,
            //    Email = invitee.Email,
            //    Role = invitee.Role
            //}));

            return boat;
        }

        [HttpGet]
        public Task<IEnumerable<Boat>> GetBoats(
            [FromQuery] int? page,
            [FromQuery] int? perPage,
            [FromQuery] string search = "")
        {
            return _boatService.GetBoats(
                HttpContext.GetUserId().Value, page, perPage, search);
        }

        [HttpGet("{boatId}")]
        public async Task<BoatDto> GetBoatById(Guid boatId)
        {
            return await _boatService.GetBoatById(boatId);
        }

        [HttpPatch("{boatId}/details")]
        public async Task UpdateDetails(Guid boatId, [FromBody] UpdateBoatDetailsRequest request)
        {
            await _boatService.UpdateBoatDetails(boatId, request);
        }

        [HttpPut("{boatId}/code")]
        public async Task<ActionResult<Code>> GenerateCodeInvite(Guid boatId, [FromQuery] int? expiresUnix)
        {
            Code code = await _boatService.GenerateCodeInvite(boatId, expiresUnix);
            return Ok(code);
        }

        [HttpGet("{boatId}/code")]
        public async Task<ActionResult<Code>> GetCodeInvite(Guid boatId)
        {
            Code code = await _boatService.GetCodeInvite(boatId);
            return Ok(code);
        }

        [HttpPost("{boatId}/code/accept")]
        public async Task<ActionResult<Boat>> AcceptCodeInvite(Guid boatId, [FromQuery] string code)
        {
            Boat boat = await _boatService.AcceptCodeInvite(boatId, code);
            return Ok(boat);
        }

        //[HttpGet("{boatId}/invites")]
        //public async Task<IEnumerable<Invite>> GetInvites(Guid boatId)
        //{
        //    // Perform read validation but don't need the result
        //    await _boatService.GetBoatById(boatId);
        //    return await _repo.GetAsync<Invite>(i => i.BoatId == boatId);
        //}

        //[HttpGet("{boatId}/invites/{inviteId}")]
        //public async Task<ActionResult<InviteDetails>> GetInvite(Guid boatId, Guid inviteId)
        //{
        //    InviteDetails invite = await _boatService.GetInviteById(boatId, inviteId);
        //    return Ok(invite);
        //}

        //[HttpPost("{boatId}/invites")]
        //public async Task<IActionResult> SendBoatInvites(Guid boatId, [FromBody] IEnumerable<Invite> invites)
        //{
        //    var newInvites = await _boatService.CreateInvites(boatId, invites);
        //    await _emailService.SendBoatInvitations(boatId, newInvites);
        //    return Ok();
        //}

        //[HttpPost("{boatId}/invites/{inviteId}/accept")]
        //public async Task<BoatDto> AcceptInvite(Guid boatId, Guid inviteId)
        //{
        //    await _boatService.AcceptBoatInvite(boatId, inviteId, HttpContext.GetClaim(ClaimTypes.Email));
        //    return await _boatService.GetBoatById(boatId);

        //}

        //[HttpPost("{boatId}/crew")]
        //public Task<Boat> AddCrewMember(Guid boatId, [FromBody] CrewMember crewMember)
        //    => _boatService.AddCrewMember(boatId, crewMember);

        //[HttpGet("{boatId}/crew")]
        //public async Task<IEnumerable<CrewMemberWithUserInfo>> GetCrew(Guid boatId)
        //{
        //    Boat boat = await _boatService.GetBoatById(boatId);
        //    var crewUserIds = boat.Crew.Select(c => c.UserId);
        //    IEnumerable<User> users = await _db.Users
        //        .GetAsync<User>(u => crewUserIds.Contains(u.Id));

        //    List<CrewMemberWithUserInfo> crew = new();
        //    foreach (var user in users)
        //    {
        //        CrewMember cm = boat.Crew.First(u => u.UserId == user.Id);
        //        crew.Add(new CrewMemberWithUserInfo
        //        {
        //            UserId = user.Id,
        //            Name = user.Name,
        //            Role = cm.Role,
        //            Info = cm.Info
        //        });
        //    }
        //    return crew;
        //}

        //[HttpDelete("{boatId}/crew/{userId}")]
        //public async Task<IActionResult> DeleteCrewMember(Guid boatId, Guid userId)
        //{
        //    await _boatService.DeleteCrewMember(boatId, userId);
        //    return Ok();
        //}
    }
}