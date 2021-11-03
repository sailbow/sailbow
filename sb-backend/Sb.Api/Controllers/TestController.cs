using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Controllers
{
    public class TestController : ApiControllerBase
    {
        [HttpGet("helloworld")]
        public object HelloWorld()
        {
            return new
            {
                Message = "Hello world!"
            };
        }
    }
}
