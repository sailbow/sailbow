using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    public class UsersController : ApiControllerBase
    {
        private readonly SbContext _db;
        private readonly BoatService _boatService;

        public UsersController(
            SbContext db,
            BoatService boatService)
        {
            _db = db;
            _boatService = boatService;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUserById(
            Guid userId,
            [FromServices] IUserService userService)
        {
            return Ok(await userService.GetUserById(userId));
        }

        [HttpGet("mates")]
        public async Task<ActionResult<IEnumerable<CrewMember>>> GetMates()
        {
            Guid userId = HttpContext.GetUserId();
            var boats = await _boatService.GetAllBoats(userId);

            List<User> users = await _db.Users
                .Where(u => u.Id == userId)
                .Include(u => u.CrewMemberships)
                    .ThenInclude(cm => cm.Boat)
                        .ThenInclude(b => b.Crew.Where(cm => cm.UserId != userId))
                .DistinctBy(u => u.Id)
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<User>>> SearchUsers(string q)
        {
            var searchResults = await _db.Users
                .Where(u => u.Name.Contains(q) || u.Email.Contains(q))
                .ToListAsync();

            return Ok(searchResults);
        }


    }
}
