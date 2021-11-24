using System.Net;

using Newtonsoft.Json;

using Sb.Api.Validation;

namespace Sb.Api.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
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
