using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using Sb.Api.Configuration;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class TokenService : ITokenService
    {
        public TokenService(
            IOptions<JwtConfig> jwtOptions,
            IRepository repo)
        {
            _jwtConfig = jwtOptions.Value;
            _repo = repo;
        }

        public async Task<TokenBase> GenerateToken(string userId, TokenType tokenType, IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var handler = new JwtSecurityTokenHandler();
            double expirationMinutes = tokenType == TokenType.Access
                ? _jwtConfig.AccessTokenExpirationMinutes
                : _jwtConfig.RefreshTokenExpirationMinutes;

            var tokenProperties = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims.Append(new Claim(nameof(tokenType), tokenType.ToString()))),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                IssuedAt = DateTime.UtcNow,
                SigningCredentials = creds
            };
            SecurityToken token = handler.CreateToken(tokenProperties);
            return await _repo.InsertAsync(new TokenBase
            {
                Value = handler.WriteToken(token),
                Expires = tokenProperties.Expires.Value,
                UserId = userId,
                Type = tokenType
            });
        }


        public async Task<bool> IsTokenValid(string userId, string token, TokenType tokenType)
        {
            TokenBase result = await GetToken(userId, token, tokenType);
            return result != null && result.Expires > DateTime.UtcNow;
        }

        public async Task RevokeToken(string userId, string token, TokenType tokenType)
        {
            await _repo.DeleteAsync<TokenBase>(t => t.UserId == userId && t.Value == token);
        }

        public async Task RevokeAllTokens(string userId)
        {
            await _repo.DeleteAsync<TokenBase>(t => t.UserId == userId);
        }

        private async Task<TokenBase> GetToken(string userId, string token, TokenType tokenType)
        {
            return await _repo.FirstOrDefaultAsync<TokenBase>(t => t.UserId == userId && t.Value == token);
        }

        private readonly JwtConfig _jwtConfig;
        private readonly IRepository _repo;
    }
}
