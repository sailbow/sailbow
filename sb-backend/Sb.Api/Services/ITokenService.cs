using System.Security.Claims;

using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface ITokenService
    {
        bool IsTokenValid(Guid userId, string token, TokenType tokenType);
        TokenBase GenerateToken(Guid userId, TokenType tokenType, IEnumerable<Claim> claims);
    }
}
