
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public partial class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpGet("login")]
        [AllowAnonymous]
        public IActionResult Login(IdentityProvider provider)
        {
            string scheme = provider == IdentityProvider.Google
                ? GoogleDefaults.AuthenticationScheme
                : FacebookDefaults.AuthenticationScheme;
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(Authorize))
            };
            return Challenge(properties, scheme);
        }

        [Route("authorize")]
        public async Task<IActionResult> Authorize()
        {
            var authResult = await HttpContext.AuthenticateAsync();
            if (authResult.Succeeded)
            {
                return Ok(new
                {
                    Token = new OAuthToken
                    {
                        AccessToken = authResult.Properties.GetTokenValue("access_token"),
                        RefreshToken = authResult.Properties.GetTokenValue("refresh_token"),
                        IssuedUtc = authResult.Properties.IssuedUtc,
                        ExpiresUtc = authResult.Properties.ExpiresUtc
                    },
                    User = GetUserFromClaims(authResult.Principal.Claims)
                });
            }
            return Unauthorized();
        }

        private User GetUserFromClaims(IEnumerable<Claim> claims)
        {
            return new User
            {
                IdentityProviderId = double.Parse(claims.FirstOrDefault(c => c.Type.EndsWith("nameidentifier")).Value),
                FirstName = claims.FirstOrDefault(c => c.Type.EndsWith("givenname")).Value,
                LastName = claims.FirstOrDefault(c => c.Type.EndsWith("surname")).Value,
                Email = claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress")).Value
            };
        }


        [Route("unauthorized")]
        [AllowAnonymous]
        public IActionResult NotAuthorized() => Unauthorized();
    }

    public class User
    {
        public int Id { get; set; }
        public double IdentityProviderId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}
