using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;

using Sb.Api.Configuration;
using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models;
using Sb.OAuth2;

namespace Sb.Api.Controllers
{
    public class EmailPasswordLogin
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
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
        public string Login(IdentityProviders provider, [FromQuery] string redirectUri, [FromQuery] string state)
        {
            return _clientFactory.GetClient(provider).GetAuthorizationEndpoint(redirectUri, null, null, state);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginEmailPassword(
            [FromBody] EmailPasswordLogin login,
            [FromServices] IUserService userService)
        {
            return Ok(await userService.AuthenticateAsync(login.Email, login.Password));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await Task.CompletedTask;
            return Ok();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(
            [FromServices] IUserService userService,
            CreateUser user)
        {
            return Ok(await userService.CreateUserAsync(user));
        }


        [HttpGet("authorize")]
        [AllowAnonymous]
        public async Task<IActionResult> Authorize(
            IdentityProviders provider,
            [FromQuery] string code,
            [FromQuery] string redirectUri,
            [FromQuery] string state,
            [FromServices] SbContext db,
            [FromServices] ITokenService tokenService)
        {
            try
            {
                OAuth2Client client = _clientFactory.GetClient(provider);
                OAuthTokens providerTokens = await client.GenerateAccessTokensAsync(code, redirectUri, state);
                AuthorizedUser user = await client.GetAuthorizedUserAsync(providerTokens.AccessToken);

                if (string.IsNullOrWhiteSpace(user.Email))
                    return BadRequest("Invalid email");

                User existingUser = await db.Users
                    .Where(u => u.Email == user.Email)
                    .Include(u => u.ConnectedAccounts)
                    .FirstOrDefaultAsync();

                if (existingUser is null)
                {
                    existingUser = new User
                    {
                        Name = user.Name,
                        Email = user.Email,
                        ConnectedAccounts = new List<ConnectedAccount>
                        {
                            new ConnectedAccount { IdentityProviderId = (IdentityProviderEnum)(int)provider }
                        }
                    };
                    await db.Users.AddAsync(existingUser);
                    await db.SaveChangesAsync();
                }
                else if (!existingUser.ConnectedAccounts.Any(ca => (int)ca.IdentityProviderId == (int)provider))
                {
                    existingUser.ConnectedAccounts.Add(new ConnectedAccount
                    {
                        IdentityProviderId = (IdentityProviderEnum)(int)provider
                    });
                    db.Users.Update(existingUser);
                    await db.SaveChangesAsync();
                }

                IEnumerable<Claim> claims = GenerateUserClaims(existingUser);
                TokenBase accessToken = tokenService.GenerateToken(existingUser.Id, TokenType.Access, claims);
                TokenBase refreshToken = tokenService.GenerateToken(existingUser.Id, TokenType.Refresh, claims);
                return Ok(new JwtTokensResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
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

        [HttpPost("refresh")]
        [AllowAnonymous]
        public IActionResult RefreshToken(
            [FromBody] TokenBase token,
            [FromServices] ITokenService tokenService)
        {
            AuthorizedUser u = HttpContext.GetUserFromClaims();
            if (!Guid.TryParse(u.Id, out Guid userId))
            {
                return BadRequest();
            }

            if (tokenService.IsTokenValid(userId, token.Value, TokenType.Refresh))
            {
                return Ok(new JwtTokensResponse
                {
                    AccessToken = tokenService.GenerateToken(userId, TokenType.Access, HttpContext.User.Claims),
                    RefreshToken = tokenService.GenerateToken(userId, TokenType.Refresh, HttpContext.User.Claims)
                });
            }
            return BadRequest();
        }

        private static IEnumerable<Claim> GenerateUserClaims(User user)
            => new List<Claim>()
                .AddIfValid(ClaimTypes.Name, user.Name)
                .AddIfValid(ClaimTypes.Email, user.Email)
                .AddIfValid(CustomClaimTypes.Id, user.Id.ToString());
    }
}
