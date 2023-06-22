using System.Linq;
using System.Security.Claims;

using Ardalis.GuardClauses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly IMapper _mapper;

        public BoatsController(
            BoatService boatService,
            EmailService emailService,
            SbContext db,
            IMapper mapper)
        {
            _boatService = boatService;
            _emailService = emailService;
            _db = db;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<Boat> CreateBoat([FromBody] CreateBoatRequest createBoatRequest)
        {
            Guid id = HttpContext.GetUserId();

            Boat newBoat = _mapper.Map<Boat>(createBoatRequest);
            newBoat.CaptainUserId = id;
            newBoat.Crew.Add(new CrewMember
            {
                UserId = id,
                Role = BoatRole.Captain
            });
            return await _boatService.CreateBoat(newBoat);
        }

        [HttpGet]
        public Task<IEnumerable<Boat>> GetBoats(
            [FromQuery] int? page,
            [FromQuery] int? perPage,
            [FromQuery] string search = "")
        {
            return _boatService.GetBoats(
                HttpContext.GetUserId(), page, perPage, search);
        }

        [HttpGet("{boatId}")]
        public async Task<BoatDto> GetBoatById(Guid boatId)
        {
            return await _boatService.GetBoatById(boatId);
        }

        [HttpPatch("{boatId}")]
        public async Task UpdateDetails(Guid boatId, [FromBody] UpdateBoatDetailsRequest request)
        {
            await _boatService.UpdateBoatDetails(boatId, request);
        }

        [HttpGet("{boatId}/modules")]
        public async Task<IEnumerable<Module>> GetBoatModules(
            Guid boatId,
            [FromServices] SbContext db)
        {
            return await db.Modules
                .Include(m => m.Settings)
                .Where(m => m.BoatId == boatId)
                .ToListAsync();
        }

        //[HttpPut("{boatId}/code")]
        //public async Task<ActionResult<BoatCode>> GenerateCodeInvite(Guid boatId, [FromQuery] int? expiresUnix)
        //{
        //    BoatCode code = await _boatService.GenerateCodeInvite(boatId, expiresUnix);
        //    return Ok(code);
        //}

        //[HttpGet("{boatId}/code")]
        //public async Task<ActionResult<BoatCode>> GetCodeInvite(Guid boatId)
        //{
        //    BoatCode code = await _boatService.GetCodeInvite(boatId);
        //    return Ok(code);
        //}

        //[HttpPost("{boatId}/code/accept")]
        //public async Task<ActionResult<Boat>> AcceptCodeInvite(Guid boatId, [FromQuery] string code)
        //{
        //    Boat boat = await _boatService.AcceptCodeInvite(boatId, code);
        //    return Ok(boat);
        //}

        [HttpPost("{boatId}/crew")]
        public async Task<IActionResult> AddCrewMember(Guid boatId, [FromBody] AddCrewMemberRequest addCrewMemberRequest)
        {
            await _boatService.AddCrewMember(boatId, addCrewMemberRequest.UserId, addCrewMemberRequest.Role);
            return Ok();
        }

        [HttpGet("{boatId}/crew")]
        public async Task<IEnumerable<CrewMemberWithUserInfo>> GetCrew(Guid boatId)
        {
            Boat boat = await _db.Boats
                .Where(b => b.Id == boatId)
                .Include(b => b.Crew)
                    .ThenInclude(cm => cm.User)
                .FirstOrDefaultAsync();

            return boat.Crew
                .Select(cm => new CrewMemberWithUserInfo
                {
                    UserId = cm.UserId,
                    Name = cm.User.Name,
                    Email = cm.User.Email,
                    Role = cm.Role
                });
        }

        [HttpDelete("{boatId}/crew/{userId}")]
        public async Task<IActionResult> DeleteCrewMember(Guid boatId, Guid userId)
        {
            await _boatService.DeleteCrewMember(boatId, userId);
            return Ok();
        }
    }
}