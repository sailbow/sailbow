using System.Security.Claims;

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
}
