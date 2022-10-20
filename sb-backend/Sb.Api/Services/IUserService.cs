using Sb.Api.Models;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface IUserService
    {
        Task<User> GetUserById(string userId);
        Task<JwtTokensResponse> AuthenticateAsync(string email, string password);
        Task<JwtTokensResponse> CreateUserAsync(CreateUser user);
    }
}