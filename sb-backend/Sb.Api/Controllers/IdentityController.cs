
using Microsoft.AspNetCore.Mvc;

using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    public class IdentityController : ApiControllerBase
    {
        private readonly IRepository _repo;
        public IdentityController(IRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            User user = await _repo.GetByIdAsync<User>(id);
            if (user is null)
                return NotFound();
            return Ok(user);
        }
    }
}