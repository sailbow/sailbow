using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface IModuleService
    {
        Task<ModuleWithData> GetModuleByIdAsync(string id);
        Task<Module> UpsertModule(Module module);
        Task<IEnumerable<ModuleData>> UpsertModuleData(string moduleId, IEnumerable<ModuleData> data);
    }
}