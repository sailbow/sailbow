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
    public async Task<ModuleWithData> GetModuleById([FromRoute] Guid boatId, [FromRoute] string moduleId)
    {
        await _boatService.GetBoatById(boatId);
        ModuleWithData m = await _moduleService.GetModuleByIdAsync(moduleId);
        if (m.BoatId != boatId)
        {
            throw new MissingEntityException($"Module '{moduleId}' not found for boat '{boatId}'");
        }
        if (m.Settings.AnonymousVoting)
        {
            foreach (ModuleOption md in m.Options)
            {
                md.Votes = new List<ModuleVote>();
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
    public async Task<ModuleWithData> UpsertModule([FromRoute] Guid boatId, [FromBody] ModuleWithData module)
    {
        module.BoatId = boatId;
        module.AuthorId = module.AuthorId ?? HttpContext.GetUserId();
        Module m = _mapper.Map<ModuleWithData, Module>(module);
        m = await _moduleService.UpsertModule(m);
        ModuleWithData returnModule = _mapper.Map<Module, ModuleWithData>(m);
        returnModule.Options = await _moduleService.UpsertModuleData(m.Id, module.Options);
        return returnModule;
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteModule(
        [FromRoute] Guid boatId,
        [FromRoute] string moduleId)
    {
        Guard.Against.NullOrWhiteSpace(boatId);
        await _moduleService.DeleteModule(HttpContext.GetUserId(), moduleId);
        return Ok();
    }

    [HttpPost("{moduleId}/{optionId}/vote")]
    public async Task<ActionResult> Vote(
        [FromRoute] Guid boatId,
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
        [FromRoute] Guid boatId,
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
