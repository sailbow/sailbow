using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TestController : ControllerBase
    {
        [HttpGet("helloworld")]
        public object HelloWorldTest()
        {
            return new
            {
                Message = "Hello world!"
            };
        }
    }
}
