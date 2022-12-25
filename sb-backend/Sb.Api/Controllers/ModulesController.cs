using Ardalis.GuardClauses;

using AutoMapper;

using Microsoft.AspNetCore.Mvc;
using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Api.Validation;
using Sb.Data.Models;

namespace Sb.Api.Controllers;

[Route("api/boats/{boatId}/modules")]
public class ModulesController : ApiControllerBase
{
    public ModulesController(
        IModuleService moduleService,
        IMapper mapper,
        BoatService boatService)
    {
        _moduleService = moduleService;
        _boatService = boatService;
        _mapper = mapper;
    }

    [HttpGet("{moduleId}")]
    public async Task<ModuleWithData> GetModuleById([FromRoute] string boatId, [FromRoute] string moduleId)
    {
        await _boatService.GetBoatById(boatId);
        ModuleWithData m = await _moduleService.GetModuleByIdAsync(moduleId);
        if (m.BoatId != boatId)
        {
            throw new MissingEntityException($"Module '{moduleId}' not found for boat '{boatId}'");
        }
        if (m.Settings.AnonymousVoting)
        {
            foreach (ModuleData md in m.Data)
            {
                md.Votes = new HashSet<string>();
            }
        }
        return m;
    }

    [HttpPatch("{moduleId}/settings")]
    public async Task UpdateModuleSettings(string moduleId, [FromBody] ModuleSettings settings)
    {
        await _moduleService.UpdateModuleSettings(moduleId, settings);
    }

    [HttpPut]
    public async Task<ModuleWithData> UpsertModule([FromRoute] string boatId, [FromBody] ModuleWithData module)
    {
        Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
        module.BoatId = boatId;
        module.Author = module.Author ?? HttpContext.GetUserId();
        foreach (ModuleData d in module.Data)
        {
            d.Author = d.Author ?? HttpContext.GetUserId();
        }
        Module m = _mapper.Map<ModuleWithData, Module>(module);
        m = await _moduleService.UpsertModule(m);
        ModuleWithData returnModule = _mapper.Map<Module, ModuleWithData>(m);
        returnModule.Data = await _moduleService.UpsertModuleData(m.Id, module.Data);
        return returnModule;
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

    [HttpPost("{moduleId}/finalizeOption")]
    public async Task FinalizeOption(string moduleId, [FromBody] FinalizeOptionRequest finalizeOptionRequest)
    {
        await _moduleService
            .FinalizeOption(HttpContext.GetUserId(), moduleId, finalizeOptionRequest.OptionId);
    }


    private readonly IModuleService _moduleService;
    private readonly BoatService _boatService;
    private readonly IMapper _mapper;
}
