using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Mvc;

using Sb.Api.Services;
using Sb.Api.Validation;
using Sb.Data.Models;

namespace Sb.Api.Controllers;

[Route("api/boats/{boatId}/modules")]
public class ModulesController : ApiControllerBase
{
    public ModulesController(
        IModuleService moduleService,
        BoatService boatService)
    {
        _moduleService = moduleService;
        _boatService = boatService;
    }

    [HttpGet("{moduleId}")]
    public async Task<Module> GetModuleById([FromRoute] string boatId, [FromRoute] string moduleId)
    {
        await _boatService.GetBoatById(boatId);
        Module m = await _moduleService.GetModuleByIdAsync(moduleId);
        if (m.BoatId != boatId)
        {
            throw new MissingEntityException($"Module '{moduleId}' not found for boat '{boatId}'");
        }
        return m;
    }

    [HttpPut]
    public async Task<Module> UpsertModule([FromRoute] string boatId, [FromBody] ModuleWithData module)
    {
        Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
        module.BoatId = boatId;
        module.Author = module.Author ?? HttpContext.GetUserId();
        foreach (ModuleData d in module.Data)
        {
            d.Author = d.Author ?? HttpContext.GetUserId();
        }
        module = (await _moduleService.UpsertModule(module)) as ModuleWithData;
        module.Data = await _moduleService.UpsertModuleData(module.Id, module.Data);
        return module;
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteModule(
        [FromRoute] string boatId,
        [FromRoute] string moduleId)
    {
        Guard.Against.NullOrWhiteSpace(boatId);
        await _moduleService.DeleteModule(HttpContext.GetUserId(), moduleId);
        return Ok();
    }

    [HttpPost("{moduleId}/{optionId}/vote")]
    public async Task<ActionResult> Vote(
        [FromRoute] string boatId,
        [FromRoute] string moduleId,
        [FromRoute] string optionId)
    {
        Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
        await _boatService.GetBoatById(boatId);
        await _moduleService.Vote(HttpContext.GetUserId(), moduleId, optionId);
        return Ok();
    }

    [HttpDelete("{moduleId}/{optionId}/vote")]
    public async Task<ActionResult> UnVote(
        [FromRoute] string boatId,
        [FromRoute] string moduleId,
        [FromRoute] string optionId)
    {
        Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
        await _boatService.GetBoatById(boatId);
        await _moduleService.UnVote(HttpContext.GetUserId(), moduleId, optionId);
        return Ok();
    }


    private readonly IModuleService _moduleService;
    private readonly BoatService _boatService;
}
