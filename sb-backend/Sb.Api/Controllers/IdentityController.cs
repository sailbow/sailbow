
using Microsoft.AspNetCore.Mvc;

using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    public class IdentityController : ApiControllerBase
    {
        private readonly SbContext _db;
        public IdentityController(SbContext db)
        {
            _db = db;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            User user = await _db.Users.FindAsync(HttpContext.GetUserId().GetValueOrDefault());
            if (user is null)
                return NotFound();
            return Ok(user);
        }
    }
}