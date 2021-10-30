
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Sb.OAuth2;
using Sb.Api.Models;

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Sb.Api.Services;
using System.Linq;

namespace Sb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public partial class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _config;
        private readonly OAuth2ClientFactory _clientFactory;

        public AuthController(ILogger<AuthController> logger, IConfiguration config, OAuth2ClientFactory clientFactory)
        {
            _logger = logger;
            _config = config;
            _clientFactory = clientFactory;
        }

        [HttpGet("login")]
        public string Login(IdentityProvider provider, [FromQuery] string redirectUri)
        {
            return _clientFactory.GetClient(provider).GetAuthorizationEndpoint(redirectUri);
        }



        [HttpGet("authorize")]
        public async Task<IActionResult> Authorize(IdentityProvider provider, [FromQuery] string code, [FromQuery] string redirectUri)
        {
            try
            {
                OAuth2Client client = _clientFactory.GetClient(provider);
                GenerateTokenResponse tokenResponse = await client.GenerateAccessTokensAsync(code, redirectUri);
                AuthorizedUser user = await client.GetAuthorizedUserAsync(tokenResponse.AccessToken);
                await SignInAsync(provider, tokenResponse, user);
                return Ok(tokenResponse);
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

        private async Task SignInAsync(IdentityProvider provider, GenerateTokenResponse token, AuthorizedUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("picture", user.GetProfilePicture()),
                new Claim("provider", provider.ToString())
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var tokens = new List<AuthenticationToken>();
            AddTokenIfValid(tokens, "accessToken", token.AccessToken);
            AddTokenIfValid(tokens, "refreshToken", token.RefreshToken);
            AddTokenIfValid(tokens, "idToken", token.IdToken);
            AuthenticationProperties authProps = new()
            {
                ExpiresUtc = token.ExpiresIn.HasValue
                    ? DateTimeOffset.UtcNow.AddSeconds(token.ExpiresIn.Value)
                    : null,
                AllowRefresh = true
            };
            authProps.StoreTokens(tokens);

            await HttpContext.SignInAsync(new ClaimsPrincipal(claimsIdentity), authProps);
        }

        private void AddTokenIfValid(IEnumerable<AuthenticationToken> tokens, string name, string token)
        {
            if (!string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(token))
            {
                tokens.Append(new AuthenticationToken { Name = name, Value = token });
            }
        }
    }
}
