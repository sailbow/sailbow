
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Sb.OAuth2;
using Microsoft.AspNetCore.Authentication.Cookies;

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
                ? _googleClient.GetAuthorizationEndpoint("https://www.googleapis.com/auth/userinfo.profile", redirectUri)
                : _fbClient.GetAuthorizationEndpoint("public_profile", redirectUri);
        }

        [HttpGet("authorize")]
        public async Task<IActionResult> Authorize(IdentityProvider provider, string code, string redirectUri)
        {
            try
            {
                object response;
                if (provider == IdentityProvider.Google)
                {
                    GenerateTokenResponse tokens = await _googleClient.GenerateAccessTokensAsync(code, redirectUri);
                    GoogleUserInfo userInfo = await _googleClient.GetUserInfo(tokens.AccessToken);
                    response = new { Tokens = tokens, User = userInfo };
                }
                else
                {
                    GenerateTokenResponse tokens = await _fbClient.GenerateAccessTokensAsync(code, redirectUri);
                    FacebookUserInfo userInfo = await _fbClient.GetUserInfo(tokens.AccessToken);
                    response = new { Tokens = tokens, User = userInfo };
                }
                
                var claimsIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(new ClaimsPrincipal(claimsIdentity));
                return Ok(response);
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

    public class User
    {
        public int Id { get; set; }
        public double IdentityProviderId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}
