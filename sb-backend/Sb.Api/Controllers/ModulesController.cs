using Microsoft.AspNetCore.Mvc;

using Sb.Api.Services;
using Sb.Data.Models;

namespace Sb.Api.Controllers;

[Route("api/boats/{boatId}/modules")]
public class ModulesController : ApiControllerBase
{
    public ModulesController(
        IModuleService moduleService)
    {
        _moduleService = moduleService;
    }

    [HttpPut]
    public async Task<Module> AddModule([FromBody] Module module)
    {
        return await _moduleService.UpsertModule(module);
    }

    private readonly IModuleService _moduleService;
}
