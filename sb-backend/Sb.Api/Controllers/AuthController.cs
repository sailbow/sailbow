using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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
        public string Login(IdentityProvider provider, [FromQuery] string redirectUri, [FromQuery] string state)
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
            IdentityProvider provider,
            [FromQuery] string code,
            [FromQuery] string redirectUri,
            [FromQuery] string state,
            [FromServices] IRepository repo,
            [FromServices] ITokenService tokenService)
        {
            try
            {
                OAuth2Client client = _clientFactory.GetClient(provider);
                OAuthTokens providerTokens = await client.GenerateAccessTokensAsync(code, redirectUri, state);
                AuthorizedUser user = await client.GetAuthorizedUserAsync(providerTokens.AccessToken);

                if (string.IsNullOrWhiteSpace(user.Email))
                    return BadRequest("Invalid email");

                User existingUser = await repo.FirstOrDefaultAsync<User>(u => u.Email == user.Email);
                if (existingUser is null)
                {
                    existingUser = await repo.InsertAsync(new User
                    {
                        Name = user.Name,
                        Email = user.Email,
                        Provider = provider.ToString(),
                        ProviderUserId = user.Id,
                        DateCreated = DateTime.UtcNow
                    });
                }

                IEnumerable<Claim> claims = GenerateUserClaims(existingUser);
                TokenBase accessToken = await tokenService.GenerateToken(existingUser.Id, TokenType.Access, claims);
                TokenBase refreshToken = await tokenService.GenerateToken(existingUser.Id, TokenType.Refresh, claims);
                return Ok(new JwtTokensResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                });
            }
            catch (OAuth2Exception e)
            {
                Console.WriteLine(e.Content);
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
        public async Task<IActionResult> RefreshToken(
            [FromBody] TokenBase token,
            [FromServices] ITokenService tokenService)
        {
            AuthorizedUser u = HttpContext.GetUserFromClaims();
            if (await tokenService.IsTokenValid(u.Id, token.Value, TokenType.Refresh))
            {
                return Ok(new JwtTokensResponse
                {
                    AccessToken = await tokenService.GenerateToken(u.Id, TokenType.Access, HttpContext.User.Claims),
                    RefreshToken = await tokenService.GenerateToken(u.Id, TokenType.Refresh, HttpContext.User.Claims)
                });
            }
            return BadRequest();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromServices] ITokenService tokenService)
        {
            string token = HttpContext.GetAccessToken();
            await tokenService.RevokeToken(HttpContext.GetUserId(), token, TokenType.Access);
            return Ok();
        }

        [HttpPost("logout-all")]
        public async Task<IActionResult> LogoutAll([FromServices] ITokenService tokenService)
        {
            await tokenService.RevokeAllTokens(HttpContext.GetUserId());
            return Ok();
        }

        private IEnumerable<Claim> GenerateUserClaims(User user)
            => new List<Claim>()
                .AddIfValid(ClaimTypes.Name, user.Name)
                .AddIfValid(ClaimTypes.Email, user.Email)
                .AddIfValid(CustomClaimTypes.Id, user.Id);
    }
}
