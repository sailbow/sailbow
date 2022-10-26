using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface IModuleService
    {
        Task<IEnumerable<Module>> GetModulesByBoatIdAsync(string boatId);
        Task<Module> GetModuleByIdAsync(string id);
        Task<Module> UpsertModule(Module module);
    }
}