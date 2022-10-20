using Sb.Api.Models;

namespace Sb.Api.Services
{
    public interface IUserService
    {
        Task<JwtTokensResponse> AuthenticateAsync(string email, string password);
        Task<JwtTokensResponse> CreateUserAsync(CreateUser user);
    }
}