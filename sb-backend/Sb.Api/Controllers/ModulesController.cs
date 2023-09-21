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
            .AsNoTracking()
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
                Deadline = createModuleRequest.VotingDeadline,
            }
        };
        await db.Modules.AddAsync(newModule);
        await db.SaveChangesAsync();
        return Ok(newModule);
    }

    [HttpGet("{moduleId}")]
    public async Task<Module> GetModuleById(
        Guid moduleId,
        [FromServices] SbContext db)
    {
        return await db.Modules
            .Include(m => m.Settings)
            .FirstOrDefaultAsync(m => m.Id == moduleId);
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
    public async Task<ModuleOption> AddModuleOption(
        Guid moduleId,
        [FromBody] ModuleOptionData optionData,
        [FromServices] SbContext db)
    {
        Module module = await db.Modules
            .Include(m => m.Boat.Crew)
            .FirstOrDefaultAsync(m => m.Id == moduleId);

        ModuleOption newOption = new()
        {
            ModuleId = moduleId,
            CreatedByCrewMemberId = module.Boat.Crew.First(cm => cm.UserId == HttpContext.GetUserId()).Id,
            Data = optionData
        };
        module.ModuleOptions.Add(newOption);
        await db.SaveChangesAsync();
        return newOption;
    }

    [HttpGet("{moduleId}/options")]
    public async Task<IEnumerable<ModuleOption>> GetModuleOptions(
        Guid moduleId,
        [FromServices] SbContext db)
    {
        return await db.ModuleOptions
            .Include(mo => mo.Votes)
            .Where(mo => mo.ModuleId == moduleId)
            .ToListAsync();
    }

    [HttpPost("{moduleId}/vote")]
    public async Task<ActionResult<ModuleOptionVote>> VoteForModuleOption(
        Guid moduleId,
        [FromBody] VoteForModuleOptionRequest voteRequest,
        [FromServices] SbContext db)
    {
        Module module = await db.Modules
            .Include(m => m.Settings)
            .Include(m => m.Boat.Crew)
            .Include(m => m.ModuleOptions)
                .ThenInclude(mo => mo.Votes)
            .FirstOrDefaultAsync(m => m.Id == moduleId);

        Guid crewMemberId = module.Boat.Crew
            .First(cm => cm.UserId == HttpContext.GetUserId())
            .Id;

        IEnumerable<ModuleOptionVote> existingVotes = module.ModuleOptions
            .SelectMany(mo => mo.Votes
                .Where(v => v.CrewMemberId == crewMemberId));

        ModuleOptionVote identicalVote = existingVotes
            .FirstOrDefault(v => v.ModuleOptionId == voteRequest.OptionId);

        if (identicalVote != null)
        {
            return Ok(identicalVote);
        }

        if (!module.Settings.AllowMultiple)
        {
            db.ModuleOptionVotes.RemoveRange(existingVotes);
        }

        await db.ModuleOptionVotes.AddAsync(new ModuleOptionVote
        {
            CrewMemberId = crewMemberId,
            ModuleOptionId = voteRequest.OptionId
        });

        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{moduleId}/vote")]
    public async Task<ActionResult> UnVote(
        Guid moduleId,
        [FromBody] UnVoteModuleOptionRequest unVoteRequest,
        [FromServices] SbContext db)
    {
        Module module = await db.Modules
            .Include(m => m.Boat.Crew)
            .Include(m => m.ModuleOptions)
                .ThenInclude(mo => mo.Votes)
            .FirstOrDefaultAsync(m => m.Id == moduleId);

        Guid crewMemberId = module.Boat.Crew
            .FirstOrDefault(cm => cm.UserId == HttpContext.GetUserId())
            .Id;

        ModuleOptionVote voteToDelete = module.ModuleOptions
            .FirstOrDefault(mo => mo.Id == unVoteRequest.OptionId)
            .Votes
            .Where(v => v.ModuleOptionId == unVoteRequest.OptionId)
            .Where(v => v.CrewMemberId == crewMemberId)
            .FirstOrDefault();

        db.ModuleOptionVotes.Remove(voteToDelete);
        await db.SaveChangesAsync();
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
