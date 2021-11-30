using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json;

using Sb.Api.Configuration;
using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models.Mongo;
using Sb.OAuth2;

namespace Sb.Api.Controllers
{
    public class AuthController : ApiControllerBase
    {
        private readonly OAuth2ClientFactory _clientFactory;
        private readonly JwtConfig _jwtConfig;
        private readonly IRepository<BlacklistedToken> _blacklistedTokenRepo;

        public AuthController(IOptions<JwtConfig> jwtOptions, OAuth2ClientFactory clientFactory, IRepository<BlacklistedToken> blacklistedTokenRepo)
        {
            _clientFactory = clientFactory;
            _jwtConfig = jwtOptions.Value;
            _blacklistedTokenRepo = blacklistedTokenRepo;
        }

        [HttpGet("login")]
        [AllowAnonymous]
        public string Login(IdentityProvider provider, [FromQuery] string redirectUri, [FromQuery] string state)
        {
            return _clientFactory.GetClient(provider).GetAuthorizationEndpoint(redirectUri, null, null, state);
        }


        [HttpGet("authorize")]
        [AllowAnonymous]
        public async Task<IActionResult> Authorize(
            IdentityProvider provider,
            [FromQuery] string code,
            [FromQuery] string redirectUri,
            [FromQuery] string state,
            [FromServices] IRepository<User> userRepository)
        {
            try
            {
                OAuth2Client client = _clientFactory.GetClient(provider);
                TokenBase providerTokens = await client.GenerateAccessTokensAsync(code, redirectUri, state);
                AuthorizedUser user = await client.GetAuthorizedUserAsync(providerTokens.AccessToken);

                if (string.IsNullOrWhiteSpace(user.Email))
                    return Unauthorized("Invalid email");

                User existingUser = (await userRepository.GetAsync(u => u.Email == user.Email)).FirstOrDefault();
                if (existingUser is not null)
                {
                    if (existingUser.Provider != provider.ToString())
                    {
                        return BadRequest("An account with this email already exists");
                    }
                }
                else
                {
                    existingUser = await userRepository.InsertAsync(new User
                    {
                        Name = user.Name,
                        Email = user.Email,
                        Provider = provider.ToString(),
                        ProviderUserId = user.Id,
                        DateCreated = DateTime.UtcNow
                    });
                }

                JwtToken token = GenerateToken(provider, providerTokens, existingUser);
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

        [HttpGet("refresh")]
        public async Task<IActionResult> RefreshAsync([FromServices] IRepository<User> userRepository)
        {
            try
            {
                IdentityProvider? provider = HttpContext.GetIdentityProvider();
                if (provider.HasValue)
                {
                    TokenBase providerTokens = HttpContext.GetProviderTokens();
                    if (string.IsNullOrWhiteSpace(providerTokens.RefreshToken))
                        return Unauthorized();

                    providerTokens = await _clientFactory
                        .GetClient(provider.Value)
                        .RefreshTokenAsync(providerTokens.RefreshToken);
                    string id = HttpContext.GetClaim(CustomClaimTypes.Id);
                    User user = await userRepository.GetByIdAsync(id);
                    JwtToken token = GenerateToken(provider.Value, providerTokens, user);
                    return Ok(token);
                }
            }
            catch (OAuth2Exception e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return Unauthorized();
                }
                return BadRequest(new
                {
                    message = e.Message
                });
            }

            return BadRequest(new
            {
                message = "Invalid identity provider"
            });
        }


        [HttpPost("logout")]
        public IActionResult Logout()
        {
            string token = HttpContext.GetAccessToken();
            if (!string.IsNullOrWhiteSpace(token))
            {
                _blacklistedTokenRepo.InsertAsync(new BlacklistedToken { Value = token });
            }

            IdentityProvider? provider = HttpContext.GetIdentityProvider();
            if (provider.HasValue)
            {
                TokenBase providerTokens = HttpContext.GetProviderTokens();
                _clientFactory.GetClient(provider.Value)
                    .RevokeTokenAsync(providerTokens.AccessToken);
            }

            return Ok();
        }

        private JwtToken GenerateToken(IdentityProvider provider, TokenBase providerToken, User user)
        {
            var claims = new List<Claim>()
                .AddIfValid(ClaimTypes.Name, user.Name)
                .AddIfValid(ClaimTypes.Email, user.Email)
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
