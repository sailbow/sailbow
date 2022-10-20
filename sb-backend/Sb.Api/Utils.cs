using System.Security.Claims;

using Newtonsoft.Json;

using Sb.OAuth2;

namespace Sb.Api
{
    public static class Utils
    {
        public static List<Claim> AddIfValid(this List<Claim> claims, string type, string value)
        {
            if (value != null && !string.IsNullOrWhiteSpace(type))
                claims.Add(new Claim(type, value));
            return claims;
        }

        public static string GetClaim(this HttpContext context, string type)
        {
            return context.User.Claims.FirstOrDefault(c => c.Type == type)?.Value;
        }

        public static string GetHeader(this HttpContext context, string name)
        {
            return context.Request.Headers[name].ToString();
        }

        public static OAuthTokens GetProviderTokens(this HttpContext context)
        {
            string providerTokens = context.GetClaim(CustomClaimTypes.ProviderTokens);

            if (!string.IsNullOrWhiteSpace(providerTokens))
            {
                return JsonConvert.DeserializeObject<OAuthTokens>(providerTokens);
            }
            return null;
        }

        public static string GetUserId(this HttpContext context)
            => context.GetClaim(CustomClaimTypes.Id);

        public static AuthorizedUser GetUserFromClaims(this HttpContext context)
        {
            return new AuthorizedUser
            {
                Id = context.GetClaim(CustomClaimTypes.Id),
                Email = context.GetClaim(ClaimTypes.Email),
                Name = context.GetClaim(ClaimTypes.Name),
                Picture = context.GetClaim(CustomClaimTypes.Picture)
            };
        }

        public static string GetAccessToken(this HttpContext context)
        {
            string token = context.Request.Headers.Authorization;
            return token?.Replace("Bearer ", string.Empty);
        }

        public static string GetHostUrl(this HttpContext context)
            => context.Request.Host.Value;
    }
}
