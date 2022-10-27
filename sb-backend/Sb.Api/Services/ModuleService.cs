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

        public async Task<Module> GetModuleByIdAsync(string id)
        {
            Guard.Against.NullOrWhiteSpace(id, nameof(id));
            var module = await _repo.GetByIdAsync<Module>(id);
            Guard.Against.EntityMissing(module, nameof(id));

            return module;
        }

        public async Task<Module> UpsertModule(Module module)
        {
            if (!string.IsNullOrWhiteSpace(module.Id))
            {
                await _repo.UpdateAsync(module);
                return module;
            }
            foreach (ModuleData d in module.Data)
            {
                if (string.IsNullOrWhiteSpace(d.Id))
                {
                    d.Id = _idGenerator.GenerateId();
                }
            }
            return await _repo.InsertAsync(module);
        }

        private Dictionary<ModuleType, Type> _moduleTypes = new()
        {
            { ModuleType.Date, typeof(DateModuleData) }
        };


        private readonly IRepository _repo;
        private readonly IIdGenerator _idGenerator;
    }
}
