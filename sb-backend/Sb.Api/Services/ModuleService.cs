using Ardalis.GuardClauses;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Sb.Data;
using Sb.Data.Models;

namespace Sb.Api.Services
{
    public class ModuleService : IModuleService
    {
        public ModuleService(
            IRepository repo,
            IIdGenerator idGenerator)
        {
            _repo = repo;
            _idGenerator = idGenerator;
        }

        public async Task<ModuleWithData> GetModuleByIdAsync(string id)
        {
            Guard.Against.NullOrWhiteSpace(id, nameof(id));
            var module = await _repo.GetByIdAsync<ModuleWithData>(id);
            Guard.Against.EntityMissing(module, nameof(id));
            module.Data = await _repo.GetAsync<ModuleData>(md => md.ModuleId == id);

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
            foreach (var item in data) { item.ModuleId = moduleId;  }

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


        private readonly IRepository _repo;
        private readonly IIdGenerator _idGenerator;
    }
}
