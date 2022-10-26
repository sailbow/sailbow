using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface IModuleService
    {
        Task<Module> GetModuleByIdAsync(string id);
        Task<Module> UpsertModule(Module module);
    }
}