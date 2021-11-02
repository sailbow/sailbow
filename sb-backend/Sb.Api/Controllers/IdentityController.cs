using Microsoft.AspNetCore.Mvc;

using Sb.Api.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Sb.Api.Controllers
{
    public class IdentityController : ApiControllerBase
    {
        public IdentityController()
        {

        }

        [HttpGet("me")]
        public IActionResult GetMe()
        {
            IEnumerable<Claim> claims = HttpContext.User.Claims;
            User user = new()
            {
                Id = claims.FirstOrDefault(c => c.Type == "id")?.Value,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                Name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                Picture = claims.FirstOrDefault(c => c.Type == "picture")?.Value
            };

            if (Enum.TryParse(claims.FirstOrDefault(c => c.Type == "provider")?.Value, out IdentityProvider p))
                user.Provider = p.ToString();

            return Ok(user);
        }
    }
}