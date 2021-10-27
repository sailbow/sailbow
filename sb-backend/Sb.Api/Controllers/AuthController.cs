
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Sb.OAuth2;

using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Sb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public partial class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _config;
        private readonly GoogleOAuth2Client _googleClient;
        private readonly FacebookOAuth2Client _fbClient;

        public AuthController(ILogger<AuthController> logger, IConfiguration config, GoogleOAuth2Client googleClient, FacebookOAuth2Client fbClient)
        {
            _logger = logger;
            _config = config;
            _googleClient = googleClient;
            _fbClient = fbClient;
        }

        [HttpGet("login")]
        public string Login(IdentityProvider provider, [FromQuery] string redirectUri)
        {
            return provider == IdentityProvider.Google
                ? _googleClient.GetAuthorizationEndpoint(HttpUtility.UrlEncode("https://www.googleapis.com/auth/userinfo.profile"), redirectUri)
                : _fbClient.GetAuthorizationEndpoint("public_profile", redirectUri);
        }

        [HttpGet("authorize")]
        public async Task<IActionResult> Authorize(IdentityProvider provider, [FromQuery] string code, [FromQuery] string redirectUri)
        {
            try
            {
                GenerateTokenResponse tokens;
                object user;
                if (provider == IdentityProvider.Google)
                {
                    tokens = await _googleClient.GenerateAccessTokensAsync(code, redirectUri);
                    user = await _googleClient.GetUserInfo(tokens.AccessToken);
                }
                else
                {
                    tokens = await _fbClient.GenerateAccessTokensAsync(code, redirectUri);
                    user = await _fbClient.GetUserInfo(tokens.AccessToken);
                }

                var claimsIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties
                {
                    AllowRefresh = true,
                    ExpiresUtc = DateTimeOffset.FromUnixTimeSeconds(long.Parse(tokens.ExpiresIn))
                });
                return Ok(new
                {
                    tokens,
                    user
                });
            }
            catch (OAuth2Exception e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return Unauthorized();
                }
                return BadRequest(new
                {
                    provider,
                    providerResponseCode = e.StatusCode,
                    providerResponseContent = e.Content
                });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }
    }
}
