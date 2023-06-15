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

        public async Task<ModuleOption> AddModuleOption(Guid userId, Guid moduleId, ModuleOption optionData)
        {
            Module module = await _db.Modules.FindAsync(moduleId);
            Guard.Against.EntityMissing(module, nameof(module));
            ModuleOption newOption = new()
            {
                AuthorId = userId,
                ModuleId = moduleId
            };
            module.ModuleOptions.Add(newOption);
            _db.Modules.Update(module);
            await _db.SaveChangesAsync();
            return newOption;
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

        public Task UpdateModuleSettings(Guid moduleId, ModuleSettings settings)
        {
            throw new NotImplementedException();
        }

        public Task VoteForModuleOption(Guid userId, Guid moduleId, Guid moduleOptionId)
        {
            throw new NotImplementedException();
        }
    }
}
