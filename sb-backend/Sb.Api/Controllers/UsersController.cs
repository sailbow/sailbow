using Microsoft.AspNetCore.Mvc;

using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Controllers
{
    public class UsersController : ApiControllerBase
    {
        public UsersController(
            IRepository<User> userRepo,
            BoatService boatService)
        {
            _userRepo = userRepo;
            _boatService = boatService;
        }

        [HttpGet("mates")]
        public async Task<ActionResult<IEnumerable<CrewMember>>> GetMates()
        {
            string userId = HttpContext.GetUserId();
            var boats = await _boatService.GetBoatsByUserId(userId);
            var mates = boats
                .SelectMany(boat => boat.Crew
                    .Where(cm => cm.UserId != userId));
            return Ok(mates);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<User>>> SearchUsers(string q)
        {
            var searchResults = await _userRepo
                .GetAsync(u => u.Email.Contains(q) || u.Name.Contains(q));
            return Ok(searchResults);
        }

        private readonly IRepository<User> _userRepo;
        private readonly BoatService _boatService;
    }
}
