
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System.Threading.Tasks;

namespace Sb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public partial class AuthController : ControllerBase
    {
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
                return Ok(new OAuthToken
                {
                    AccessToken = authResult.Properties.GetTokenValue("access_token"),
                    RefreshToken = authResult.Properties.GetTokenValue("refresh_token"),
                    IssuedUtc = authResult.Properties.IssuedUtc,
                    ExpiresUtc = authResult.Properties.ExpiresUtc
                });
            }
            return Unauthorized();
        }

        [Route("unauthorized")]
        [AllowAnonymous]
        public IActionResult NotAuthorized() => Unauthorized();
    }
}
