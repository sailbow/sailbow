using System.Security.Claims;

using Ardalis.GuardClauses;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Sb.Api.Models;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class UserService : IUserService
    {
        private readonly ITokenService _tokenService;
        private readonly SbContext _db;

        public UserService(
            ITokenService tokenService,
            SbContext db)
        {
            _tokenService = tokenService;
            _db = db;
        }

        public async Task<User> GetUserById(Guid userId)
        {
            User user = await _db.Users.FindAsync(userId);
            Guard.Against.EntityMissing(user, nameof(user));
            return user;
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

            if ((await _db.Users.FirstOrDefaultAsync(u => u.Email == user.Email)) != null)
                throw new ValidationException("An account already exists with this email");


            User u = new User
            {
                Name = user.Name,
                Email = user.Email,
                Hash = BCrypt.Net.BCrypt.HashPassword(user.Password)
            };

            await _db.Users.AddAsync(u);
            await _db.SaveChangesAsync();
            return new JwtTokensResponse
            {
                AccessToken = _tokenService.GenerateToken(u.Id, TokenType.Access, GenerateUserClaims(u)),
                RefreshToken = _tokenService.GenerateToken(u.Id, TokenType.Refresh, GenerateUserClaims(u))
            };
        }

        public async Task<JwtTokensResponse> AuthenticateAsync(string email, string password)
        {
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            Guard.Against.EntityMissing(user, nameof(user));
            if (!BCrypt.Net.BCrypt.Verify(password, user.Hash)) throw new ValidationException("Invalid email or password");
            return new JwtTokensResponse
            {
                AccessToken = _tokenService.GenerateToken(user.Id, TokenType.Access, GenerateUserClaims(user)),
                RefreshToken = _tokenService.GenerateToken(user.Id, TokenType.Refresh, GenerateUserClaims(user))
            };
        }

        private IEnumerable<Claim> GenerateUserClaims(User user)
            => new List<Claim>()
                .AddIfValid(ClaimTypes.Name, user.Name)
                .AddIfValid(ClaimTypes.Email, user.Email)
                .AddIfValid(CustomClaimTypes.Id, user.Id.ToString());
    }
}
