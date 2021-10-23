using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TestController : ControllerBase
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
