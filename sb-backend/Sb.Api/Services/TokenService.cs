using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using Sb.Api.Configuration;
using Sb.Data;
using Sb.Api.Models;

namespace Sb.Api.Services
{
    public class TokenService : ITokenService
    {
        public TokenService(IOptions<JwtConfig> jwtOptions)
        {
            _jwtConfig = jwtOptions.Value;
        }

        public TokenBase GenerateToken(Guid userId, TokenType tokenType, IEnumerable<Claim> claims)
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
            return new TokenBase
            {
                Type = tokenType,
                Expires = token.ValidTo,
                Value = handler.WriteToken(token),
                UserId = userId
            };
        }


        public bool IsTokenValid(Guid userId, string token, TokenType tokenType)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_jwtConfig.Key);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = _jwtConfig.Issuer,
                    ValidateLifetime = true,
                    ValidAudience = _jwtConfig.Audience
                }, out _);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private readonly JwtConfig _jwtConfig;
    }
}
