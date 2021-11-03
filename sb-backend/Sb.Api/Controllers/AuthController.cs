
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json;

using Sb.Api.Models;
using Sb.Api.Services;
using Sb.OAuth2;

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Sb.Api.Controllers
{
    public class AuthController : ApiControllerBase
    {
        private readonly OAuth2ClientFactory _clientFactory;
        private readonly JwtConfig _jwtConfig;

        public AuthController(IOptions<JwtConfig> jwtOptions, OAuth2ClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _jwtConfig = jwtOptions.Value;
        }

        [HttpGet("login")]
        [AllowAnonymous]
        public string Login(IdentityProvider provider, [FromQuery] string redirectUri)
        {
            return _clientFactory.GetClient(provider).GetAuthorizationEndpoint(redirectUri);
        }


        [HttpGet("authorize")]
        [AllowAnonymous]
        public async Task<IActionResult> Authorize(IdentityProvider provider, [FromQuery] string code, [FromQuery] string redirectUri)
        {
            try
            {
                OAuth2Client client = _clientFactory.GetClient(provider);
                TokenBase providerTokens = await client.GenerateAccessTokensAsync(code, redirectUri);
                AuthorizedUser user = await client.GetAuthorizedUserAsync(providerTokens.AccessToken);
                JwtToken token = GenerateToken(provider, providerTokens, user);
                return Ok(token);
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

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshAsync()
        {
            IdentityProvider? provider = HttpContext.GetIdentityProvider();
            if (provider.HasValue)
            {
                TokenBase providerTokens = HttpContext.GetProviderTokens();
                providerTokens = await _clientFactory
                    .GetClient(provider.Value)
                    .RefreshTokenAsync(providerTokens.RefreshToken);
                AuthorizedUser user = HttpContext.GetUserFromClaims();
                JwtToken token = GenerateToken(provider.Value, providerTokens, user);
                return Ok(token);
            }
            return BadRequest(new
            {
                message = "Invalid identity provider"
            });
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }

        private JwtToken GenerateToken(IdentityProvider provider, TokenBase providerToken, AuthorizedUser user)
        {
            var claims = new List<Claim>()
                .AddIfValid(ClaimTypes.Name, user.Name)
                .AddIfValid(ClaimTypes.Email, user.Email)
                .AddIfValid(CustomClaimTypes.Picture, user.GetProfilePicture())
                .AddIfValid(CustomClaimTypes.Id, user.Id)
                .AddIfValid(CustomClaimTypes.Provider, provider.ToString())
                .AddIfValid(CustomClaimTypes.ProviderTokens, JsonConvert.SerializeObject(providerToken));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var handler = new JwtSecurityTokenHandler();
            var tokenProperties = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                Expires = providerToken.ExpiresIn.HasValue
                    ? DateTime.UtcNow.AddSeconds(providerToken.ExpiresIn.Value)
                    : null,
                IssuedAt = DateTime.UtcNow,
                SigningCredentials = creds
            };
            SecurityToken token = handler.CreateToken(tokenProperties);
            return new JwtToken
            {
                AccessToken = handler.WriteToken(token),
                ExpiresAt = tokenProperties.Expires,
            };
        }
    }
}
