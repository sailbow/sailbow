using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Ardalis.GuardClauses;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using Sb.Api.Configuration;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface ITokenService
    {
        Task<bool> IsTokenValid(string userId, string token, TokenType tokenType);
        Task<TokenBase> GenerateToken(string userId, TokenType tokenType, IEnumerable<Claim> claims);
        Task RevokeToken(string userId, string token, TokenType tokenType);
        Task RevokeAllTokens(string userId);
    }

    public class TokenService : ITokenService
    {
        public TokenService(
            IOptions<JwtConfig> jwtOptions,
            IRepository<TokenBase> tokenRepo)
        {
            _jwtConfig = jwtOptions.Value;
            _tokenRepo = tokenRepo;
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
            return await _tokenRepo.InsertAsync(new TokenBase
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
            TokenBase result = await GetToken(userId, token, tokenType);
            if (result != null)
            {
                await _tokenRepo.DeleteAsync(result);
            }
        }

        public async Task RevokeAllTokens(string userId)
        {
            IEnumerable<TokenBase> tokens = await _tokenRepo.GetAsync(t => t.UserId == userId);
            foreach(var token in tokens)
            {
                await _tokenRepo.DeleteAsync(token);
            }
        }

        private async Task<TokenBase> GetToken(string userId, string token, TokenType tokenType)
        {
            return await _tokenRepo.FirstOrDefaultAsync(t => t.UserId == userId && t.Value == token);
        }

        private readonly JwtConfig _jwtConfig;
        private readonly IRepository<TokenBase> _tokenRepo;
    }
}
