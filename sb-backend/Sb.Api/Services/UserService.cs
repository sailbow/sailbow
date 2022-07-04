using System.Security.Claims;

using Ardalis.GuardClauses;

using Sb.Api.Models;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _userRepo;
        private readonly ITokenService _tokenService;

        public UserService(
            IRepository<User> userRepo,
            ITokenService tokenService)
        {
            _userRepo = userRepo;
            _tokenService = tokenService;
        }

        public async Task<JwtTokensResponse> CreateUserAsync(CreateUser user)
        {
            if (
                string.IsNullOrWhiteSpace(user.Email) ||
                string.IsNullOrWhiteSpace(user.Password) ||
                user.Password != user.ConfirmPassword)
            {
                throw new ValidationException("Invalid email or passwords don't match");
            }

            if (await _userRepo.FirstOrDefaultAsync(u => u.Email == user.Email) != null)
                throw new ValidationException("An account already exists with this email");

            User u = await _userRepo.InsertAsync(new User
            {
                Name = user.Name,
                Email = user.Email,
                Hash = BCrypt.Net.BCrypt.HashPassword(user.Password),
                DateCreated = DateTime.UtcNow
            });
            return new JwtTokensResponse
            {
                AccessToken = await _tokenService.GenerateToken(u.Id, TokenType.Access, GenerateUserClaims(u)),
                RefreshToken = await _tokenService.GenerateToken(u.Id, TokenType.Refresh, GenerateUserClaims(u))
            };
        }

        public async Task<JwtTokensResponse> AuthenticateAsync(string email, string password)
        {
            User u = await _userRepo.FirstOrDefaultAsync(u => u.Email == email);
            Guard.Against.EntityMissing(u, nameof(email));
            if (!BCrypt.Net.BCrypt.Verify(password, u.Hash)) throw new ValidationException("Invalid email or password");
            return new JwtTokensResponse
            {
                AccessToken = await _tokenService.GenerateToken(u.Id, TokenType.Access, GenerateUserClaims(u)),
                RefreshToken = await _tokenService.GenerateToken(u.Id, TokenType.Refresh, GenerateUserClaims(u))
            };
        }

        private IEnumerable<Claim> GenerateUserClaims(User user)
            => new List<Claim>()
                .AddIfValid(ClaimTypes.Name, user.Name)
                .AddIfValid(ClaimTypes.Email, user.Email)
                .AddIfValid(CustomClaimTypes.Id, user.Id);
    }
}
