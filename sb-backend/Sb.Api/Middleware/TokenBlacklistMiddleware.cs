using System.Net;

using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Middleware
{
    public class TokenBlacklistMiddleware : IMiddleware
    {
        private readonly IRepository<BlacklistedToken> _blacklistedTokenRepo;
        private readonly List<string> _publicEndpoints = new()
        {
            "/api/auth/login",
            "/api/auth/authorize"
        };

        public TokenBlacklistMiddleware(IRepository<BlacklistedToken> blacklistedTokenRepo)
        {
            _blacklistedTokenRepo = blacklistedTokenRepo;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (!_publicEndpoints.Contains(context.Request.Path.ToString()))
            {
                string token = context.GetAccessToken();
                if (string.IsNullOrWhiteSpace(token)
                    || (await _blacklistedTokenRepo.GetAsync(t => t.Value == token)).Any())
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
            }
            await next(context);
        }
    }
}
