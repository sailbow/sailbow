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
        ModuleService moduleService,
        IMapper mapper,
        BoatService boatService)
    {
        _moduleService = moduleService;
        _boatService = boatService;
        _mapper = mapper;
    }

    [HttpGet("{moduleId}")]
    public async Task<Module> GetModuleById([FromRoute] Guid boatId, [FromRoute] Guid moduleId)
    {
        await _boatService.GetBoatById(boatId);
        Module m = await _moduleService.GetModuleByIdAsync(moduleId);
        if (m.BoatId != boatId)
        {
            throw new MissingEntityException($"Module '{moduleId}' not found for boat '{boatId}'");
        }
        return m;
    }

    [HttpPatch("{moduleId}/settings")]
    public async Task UpdateModuleSettings(Guid moduleId, [FromBody] ModuleSettings settings)
    {
        await _moduleService.UpdateModuleSettings(moduleId, settings);
    }

    //[HttpPut]
    //public async Task<ModuleWithData> UpsertModule([FromRoute] Guid boatId, [FromBody] ModuleWithData module)
    //{
    //    module.BoatId = boatId;
    //    module.AuthorId = module.AuthorId ?? HttpContext.GetUserId();
    //    Module m = _mapper.Map<ModuleWithData, Module>(module);
    //    m = await _moduleService.UpsertModule(m);
    //    ModuleWithData returnModule = _mapper.Map<Module, ModuleWithData>(m);
    //    returnModule.Options = await _moduleService.UpsertModuleData(m.Id, module.Options);
    //    return returnModule;
    //}

    [HttpDelete]
    public async Task<ActionResult> DeleteModule(
        [FromRoute] Guid boatId,
        [FromRoute] Guid moduleId)
    {
        await _moduleService.DeleteModule(HttpContext.GetUserId(), moduleId);
        return Ok();
    }

    [HttpPost("{moduleId}/{optionId}/vote")]
    public async Task<ActionResult> Vote(
        [FromRoute] Guid boatId,
        [FromRoute] Guid moduleId,
        [FromRoute] Guid optionId)
    {
        await _boatService.GetBoatById(boatId);
        await _moduleService.VoteForModuleOption(HttpContext.GetUserId(), moduleId, optionId);
        return Ok();
    }

    [HttpDelete("{moduleId}/{optionId}/vote")]
    public async Task<ActionResult> UnVote(
        [FromRoute] Guid boatId,
        [FromRoute] Guid moduleId,
        [FromRoute] Guid optionId)
    {
        await _boatService.GetBoatById(boatId);
        await _moduleService.UnVote(HttpContext.GetUserId(), moduleId);
        return Ok();
    }

    //[HttpPost("{moduleId}/finalizeOption")]
    //public async Task FinalizeOption(string moduleId, [FromBody] FinalizeOptionRequest finalizeOptionRequest)
    //{
    //    await _moduleService
    //        .FinalizeOption(HttpContext.GetUserId(), moduleId, finalizeOptionRequest.OptionId);
    //}


    private readonly ModuleService _moduleService;
    private readonly BoatService _boatService;
    private readonly IMapper _mapper;
}
