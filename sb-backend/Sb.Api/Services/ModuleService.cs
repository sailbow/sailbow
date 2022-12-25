using Ardalis.GuardClauses;

using AutoMapper;

using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class ModuleService : IModuleService
    {
        public ModuleService(
            IRepository repo,
            IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<ModuleWithData> GetModuleByIdAsync(string moduleId)
        {
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            var module = await _repo.GetByIdAsync<Module>(moduleId);
            Guard.Against.EntityMissing(module, nameof(moduleId));

            var moduleWithData = _mapper.Map<Module, ModuleWithData>(module);
            moduleWithData.Data = await _repo.GetAsync<ModuleData>(md => md.ModuleId == moduleId);
            foreach (ModuleData d in moduleWithData.Data)
            {
                d.NumVotes = d.Votes.Count;
            }
            return moduleWithData;
        }

        public async Task<Module> UpsertModule(Module module)
        {
            if (!string.IsNullOrWhiteSpace(module.Id))
            {
                await _repo.UpdateAsync(module);
                return module;
            }
            return await _repo.InsertAsync(module);
        }

        public async Task<ModuleData> AddModuleData(ModuleData data)
        {
            Guard.Against.NullOrWhiteSpace(data.ModuleId, nameof(data.ModuleId));
            Module module = await _repo.GetByIdAsync<Module>(data.ModuleId);
            Guard.Against.EntityMissing(module, $"Module with id {data.ModuleId} does not exist");

            return await _repo.InsertAsync(data);
        }

        public async Task DeleteModuleData(string moduleDataId)
        {
            Guard.Against.NullOrWhiteSpace(moduleDataId, nameof(moduleDataId));
            await _repo.DeleteByIdAsync<ModuleData>(moduleDataId);
        }

        public async Task<IEnumerable<ModuleData>> UpsertModuleData(string moduleId, IEnumerable<ModuleData> data)
        {
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            foreach (var item in data) { item.ModuleId = moduleId; }

            var existingModuleData = await _repo.GetAsync<ModuleData>(md => md.ModuleId == moduleId);

            var newData = data.Where(d => string.IsNullOrWhiteSpace(d.Id));
            var updatedData = data.Where(d => !string.IsNullOrWhiteSpace(d.Id));
            var removedData = existingModuleData.Where(d => !data.Any(d2 => d.Id == d2.Id));

            if (newData.Any())
            {
                newData = await _repo.InsertManyAsync(newData);
            }
            await Task.WhenAll(updatedData
                .Select(d => _repo.UpdateAsync(d))
                .Concat(removedData
                    .Select(rd => _repo.DeleteByIdAsync<ModuleData>(rd.Id))));

            return newData.Concat(updatedData);
        }

        public async Task DeleteModule(string userId, string moduleId)
        {
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));

            await Task.WhenAll(
                _repo.DeleteAsync<ModuleData>(md => md.ModuleId == moduleId),
                _repo.DeleteByIdAsync<Module>(moduleId));
        }

        public async Task Vote(string userId, string moduleId, string optionId)
        {
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            Guard.Against.NullOrWhiteSpace(optionId, nameof(optionId));

            ModuleWithData module = await GetModuleByIdAsync(moduleId);

            if (!string.IsNullOrWhiteSpace(module.FinalizedOptionId))
            {
                throw new ValidationException("Cannot vote for a finalized module");
            }

            ModuleData option = module.Data.FirstOrDefault(options => options.Id == optionId);
            Guard.Against.EntityMissing(option, $"Option with id '{optionId}' does not exist");

            if (option.Votes.Add(userId))
            {
                if (!module.Settings.AllowMultiple)
                {
                    var previousVotedOptions = module.Data
                        .Where(o => o.Id != optionId)
                        .Where(o => o.Votes.Contains(userId));

                    foreach (var prevOption in previousVotedOptions)
                    {
                        prevOption.Votes.Remove(userId);
                    }
                    await Task.WhenAll(previousVotedOptions
                        .Select(o => _repo.UpdateAsync(o)));

                }
                await _repo.UpdateAsync(option);
            }
        }

        public async Task UnVote(string userId, string moduleId, string optionId)
        {
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            Guard.Against.NullOrWhiteSpace(optionId, nameof(optionId));

            ModuleWithData module = await GetModuleByIdAsync(moduleId);

            if (!string.IsNullOrWhiteSpace(module.FinalizedOptionId))
            {
                throw new ValidationException("Cannot vote for a finalized module");
            }

            ModuleData votedOption = module.Data
                .FirstOrDefault(o => o.Votes.Contains(userId));

            if (votedOption != null)
            {
                votedOption.Votes.Remove(userId);
                await _repo.UpdateAsync(votedOption);
            }
        }

        public async Task FinalizeOption(string userId, string moduleId, string optionId)
        {
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            Guard.Against.NullOrWhiteSpace(optionId, nameof(optionId));

            ModuleWithData module = await GetModuleByIdAsync(moduleId);
            if (!string.IsNullOrWhiteSpace(module.FinalizedOptionId))
            {
                throw new ValidationException("Module option has already been finalized");
            }

            Guard.Against.EntityMissing(
                module.Data.FirstOrDefault(md => md.Id == optionId),
                $"Module option with id {optionId} doesn't exist");

            Module update = _mapper.Map<ModuleWithData, Module>(module);
            update.FinalizedOptionId = optionId;
            await _repo.UpdateAsync(update);
        }

        public async Task FinalizeVotes(string userId, string moduleId)
        {
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));

            ModuleWithData module = await GetModuleByIdAsync(moduleId);

            module.FinalizedOptionId = module.Data
                .OrderByDescending(o => o.Votes.Count())
                .FirstOrDefault()?
                .Id;

            if (!string.IsNullOrWhiteSpace(module.FinalizedOptionId))
            {
                Module updateModule = _mapper.Map<ModuleWithData, Module>(module);
                await _repo.UpdateAsync(updateModule);
            }
        }

        public async Task UpdateModuleSettings(string moduleId, ModuleSettings settings)
        {
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            Module m = await _repo.GetByIdAsync<Module>(moduleId);
            Guard.Against.EntityMissing(m, $"Module with id {moduleId} doesn't exist");

            m.Settings = settings;
            await _repo.UpdateAsync(m);
        }

        private readonly IRepository _repo;
        private readonly IMapper _mapper;
    }
}
