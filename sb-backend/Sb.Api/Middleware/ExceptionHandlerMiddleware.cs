using System.Net;

using Newtonsoft.Json;

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
                string result;

                switch (error)
                {
                    case MissingEntityException:
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        break;
                    case ForbiddenResourceException:
                        response.StatusCode = (int)HttpStatusCode.Forbidden;
                        break;
                    case ValidationException:
                    case ArgumentException:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        result = JsonConvert.SerializeObject(new { message = error?.Message }, Formatting.Indented);
                        break;
                    default:
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }
            }
        }
    }
}
