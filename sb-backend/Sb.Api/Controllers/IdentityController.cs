using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Controllers
{
    public class IdentityController : ApiControllerBase
    {
        private readonly IRepository<User> _userRepo;
        public IdentityController(IRepository<User> userRepository)
        {
            _userRepo = userRepository;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            User user = await _userRepo.GetByIdAsync(id);
            if (user is null)
                return NotFound();
            return Ok(user);
        }
    }
}