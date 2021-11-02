using Microsoft.AspNetCore.Http;

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Sb.Api
{
    internal static class Utils
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
    }
}
