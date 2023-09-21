using Ardalis.GuardClauses;

using AutoMapper;

using Microsoft.EntityFrameworkCore;

using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class ModuleService
    {
        private readonly SbContext _db;
        private readonly IMapper _mapper;

        public ModuleService(
            SbContext db,
            IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task DeleteModule(Guid userId, Guid moduleId)
        {
            await _db.Modules
                .Where(m => m.Id == moduleId)
                .ExecuteDeleteAsync();
        }

        public Task DeleteModuleOption(Guid moduleOptionId)
        {
            throw new NotImplementedException();
        }

        public async Task<Module> GetModuleByIdAsync(Guid moduleId)
        {
            return await _db.Modules.FindAsync(moduleId);
        }

        public Task UnVote(Guid userId, Guid moduleId)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateModuleSettings(ModuleSettings settings)
        {
            ModuleSettings existingSettings = await _db.ModuleSettings.FindAsync(settings.ModuleId);
            existingSettings.AllowMultiple = settings.AllowMultiple;
            existingSettings.AnonymousVoting = settings.AnonymousVoting;
            existingSettings.Deadline = settings.Deadline;

            await _db.SaveChangesAsync();
        }

        public Task VoteForModuleOption(Guid userId, Guid moduleId, Guid moduleOptionId)
        {
            throw new NotImplementedException();
        }
    }
}
