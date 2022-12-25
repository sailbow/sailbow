using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface IModuleService
    {
        Task<ModuleWithData> GetModuleByIdAsync(string id);
        Task<Module> UpsertModule(Module module);
        Task UpdateModuleSettings(string moduleId, ModuleSettings settings);
        Task<IEnumerable<ModuleData>> UpsertModuleData(string moduleId, IEnumerable<ModuleData> data);
        Task<ModuleData> AddModuleData(ModuleData data);
        Task DeleteModuleData(string moduleDataId);
        Task DeleteModule(string userId, string moduleId);
        Task Vote(string userId, string moduleId, string optionId);
        Task UnVote(string userId, string moduleId, string optionId);
        Task FinalizeVotes(string userId, string moduleId);
        Task FinalizeOption(string userId, string moduleId, string optionId);
    }
}