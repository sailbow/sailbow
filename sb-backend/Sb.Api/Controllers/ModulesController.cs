using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;

using Sb.Api.Services;
using Sb.Data.Models;
using Sb.Data.Serialization;

namespace Sb.Api.Controllers;

[Route("api/boats/{boatId}/modules")]
public class ModulesController : ApiControllerBase
{
    public ModulesController(
        IModuleService moduleService)
    {
        _moduleService = moduleService;
    }

    [HttpGet]
    public async Task<IEnumerable<Module>> GetModules([FromRoute] string boatId)
    {
        return await _moduleService.GetModulesByBoatIdAsync(boatId);
    }

    [HttpPut]
    public async Task<Module> UpsertModule([FromRoute]string boatId, [FromBody] Module module)
    {
        Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
        module.BoatId = boatId;
        foreach (ModuleData d in module.Data)
        {
            d.Author = HttpContext.GetUserId();
        }
        return await _moduleService.UpsertModule(module);
    }

    private readonly IModuleService _moduleService;
}
