using Ardalis.GuardClauses;

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

        public async Task<Module> GetModuleByIdAsync(string id)
        {
            Guard.Against.NullOrWhiteSpace(id, nameof(id));
            var module = await _repo.GetByIdAsync<Module>(id);
            Guard.Against.EntityMissing(module, nameof(id));

            List<ModuleData> data = new();
            foreach (var d in module.Data)
            {
                data.Add(ConvertModuleData(module.Type, d));
            }
            module.Data = data;
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

        private ModuleData ConvertModuleData(ModuleType type, object data)
        {
            ModuleData d = type switch
            {
                ModuleType.Date => (DateModuleData)data,
                _ => throw new ArgumentException($"Module type '{type}' is not yet supported")
            };
            d.Id = d.Id ?? Guid.NewGuid().ToString();
            return d;
        }


        private readonly IRepository _repo;
    }
}
