using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Mvc;

using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Controllers
{
    public class BoatsController : ApiControllerBase
    {
        private readonly BoatService _boatService;
        private readonly IRepository<User> _userRepo;
        
        public BoatsController(BoatService boatService, IRepository<User> userRepo)
        {
            _boatService = boatService;
            _userRepo = userRepo;
        }

        [HttpPost]
        public async Task<Boat> CreateBoat([FromBody] Boat boat)
        {
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            User user = await _userRepo.GetByIdAsync(id);
            Guard.Against.Null(user, nameof(user));

            boat.Crew = new List<CrewMember>
            {
                new CrewMember
                {
                    UserId = id,
                    Role = Role.Captain,
                    Info = string.Empty
                }
            };
            return await _boatService.CreateBoat(boat);
        }

        [HttpGet("{boatId}")]
        public async Task<Boat> GetBoatById(string boatId)
        {
            Boat boat = await _boatService.GetBoatById(boatId);
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            CrewMember crewMember = boat.Crew.FirstOrDefault(cm => cm.UserId == id);
            if (crewMember is null)
            {
                throw new UnauthorizedException();
            }
            boat.Show = crewMember.Role == Role.Captain;
            return boat;
        }


        [HttpPost("{boatId}/crew")]
        public Task<Boat> AddCrewMember(string boatId, [FromBody] CrewMember crewMember)
            => _boatService.AddCrewMember(boatId, crewMember);

        [HttpGet("{boatId}/crew")]
        public async Task<IEnumerable<CrewMemberWithUserInfo>> GetCrew(string boatId)
        {
            Boat boat = await _boatService.GetBoatById(boatId);
            IEnumerable<User> users = await _userRepo
                .GetAsync(u => boat.Crew.Any(cm => cm.UserId == u.Id));

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