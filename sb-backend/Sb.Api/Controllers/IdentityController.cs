using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Linq;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Sb.OAuth2;
using Sb.Api.Models;
using Sb.Api.Services;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class IdentityController : ControllerBase
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