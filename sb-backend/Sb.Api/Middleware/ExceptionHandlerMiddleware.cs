using System.Net;

using Sb.Api.Validation;

namespace Sb.Api.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                _logger.LogError(error, error.Message);
                HttpResponse response = context.Response;
                response.ContentType = "application/json";

                switch (error)
                {
                    case MissingEntityException:
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        break;
                    case ForbiddenResourceException:
                        response.StatusCode = (int)HttpStatusCode.Forbidden;
                        break;
                    case ConflictException:
                        response.StatusCode = (int)HttpStatusCode.Conflict;
                        break;
                    case ValidationException:
                    case ArgumentException:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        await response.WriteAsJsonAsync(new { message = error?.ToString()});
                        break;
                    default:
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }
            }
        }
    }
}
