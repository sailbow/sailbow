using System.Net;

using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Middleware
{
    public class ValidateAccessTokenMiddleware : IMiddleware
    {

        public ValidateAccessTokenMiddleware(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (!_publicEndpoints.Contains(context.Request.Path.ToString()))
            {
                string token = context.GetAccessToken();
                string userId = context.GetUserId();
                if(string.IsNullOrWhiteSpace(token)
                    || string.IsNullOrWhiteSpace(userId)
                    || !(await _tokenService.IsTokenValid(userId, token, TokenType.Access)))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
            }
            await next(context);
        }

        private readonly ITokenService _tokenService;
        private readonly List<string> _publicEndpoints = new()
        {
            "/api/auth/login",
            "/api/auth/authorize"
        };
    }
}
