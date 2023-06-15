using Ardalis.GuardClauses;

using AutoMapper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Controllers;

[Route("api/modules")]
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

    [HttpPost]
    public async Task<ActionResult<Module>> CreateModule(
    [FromBody] CreateModuleRequest createModuleRequest,
    [FromServices] SbContext db)
    {
        Boat boat = await db.Boats
            .Where(b => b.Id == createModuleRequest.BoatId)
            .Include(b => b.Crew)
            .FirstOrDefaultAsync();

        Module newModule = new()
        {
            BoatId = createModuleRequest.BoatId,
            CreatedByCrewMemberId = boat.Crew
                .First(cm => cm.UserId == HttpContext.GetUserId())
                .Id,
            Name = createModuleRequest.Name,
            Description = createModuleRequest.Description,
            Settings = new ModuleSettings
            {
                AllowMultiple = createModuleRequest.AllowMultipleVotes,
                AnonymousVoting = createModuleRequest.AnonymousVoting,
                Deadline = createModuleRequest.VotingDeadling,
            }
        };
        await db.Modules.AddAsync(newModule);
        await db.SaveChangesAsync();
        return Ok(newModule);
    }

    [HttpGet("{moduleId}")]
    public async Task<Module> GetModuleById(Guid moduleId)
    {
        return await _moduleService.GetModuleByIdAsync(moduleId);
    }

    [HttpPatch("{moduleId}/settings")]
    public async Task UpdateModuleSettings(Guid moduleId, [FromBody] ModuleSettings settings)
    {
        settings.ModuleId = moduleId;
        await _moduleService.UpdateModuleSettings(settings);
    }


    [HttpDelete("{moduleId}")]
    public async Task<ActionResult> DeleteModule(Guid moduleId)
    {
        await _moduleService.DeleteModule(HttpContext.GetUserId(), moduleId);
        return Ok();
    }

    [HttpPost("{moduleId}/options")]
    public async Task AddModuleOption(Guid moduleId, [FromBody] ModuleOption option)
    {
        await Task.CompletedTask;
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
