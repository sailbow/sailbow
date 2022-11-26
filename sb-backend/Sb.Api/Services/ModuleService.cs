using Ardalis.GuardClauses;

using Sb.Api.Validation;
using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class ModuleService : IModuleService
    {
        public ModuleService(
            IRepository repo)
        {
            _repo = repo;
        }

        public async Task<ModuleWithData> GetModuleByIdAsync(string moduleId)
        {
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            var module = await _repo.GetByIdAsync<ModuleWithData>(moduleId);
            Guard.Against.EntityMissing(module, nameof(moduleId));
            module.Data = await _repo.GetAsync<ModuleData>(md => md.ModuleId == moduleId);

            return module;
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

        public async Task<IEnumerable<ModuleData>> UpsertModuleData(string moduleId, IEnumerable<ModuleData> data)
        {
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
            foreach (var item in data) { item.ModuleId = moduleId; }

            var newData = data.Where(d => string.IsNullOrWhiteSpace(d.Id));
            var updatedData = data.Where(d => !string.IsNullOrWhiteSpace(d.Id));

            if (newData.Any()) await _repo.InsertManyAsync(newData);
            if (updatedData.Any())
            {
                await Task.WhenAll(updatedData
                    .Select(d => _repo.UpdateAsync(d)));
            }
            return newData.Union(updatedData);
        }

        public async Task DeleteModule(string userId, string moduleId)
        {
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));
            Guard.Against.NullOrWhiteSpace(moduleId, nameof(moduleId));
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
                    ModuleData previousVoteOption = module.Data
                        .Where(o => o.Id != optionId)
                        .FirstOrDefault(o => o.Votes.Contains(userId));
                    if (previousVoteOption != null)
                    {
                        previousVoteOption.Votes.Remove(userId);
                        await _repo.UpdateAsync(previousVoteOption);
                    }
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
                await _repo.UpdateAsync(module);
            }
        }

        private readonly IRepository _repo;
    }
}
