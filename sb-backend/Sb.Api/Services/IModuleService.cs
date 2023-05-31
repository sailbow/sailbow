using Sb.Data.Models;

namespace Sb.Api.Services
{
    public interface IModuleService
    {
        Task<Module> GetModuleByIdAsync(Guid moduleId);
        Task UpdateModuleSettings(Guid moduleId, ModuleSettings settings);
        Task<ModuleOption> AddModuleOption(ModuleOption data);
        Task DeleteModuleOption(Guid moduleOptionId);
        Task DeleteModule(Guid userId, Guid moduleId);
        Task VoteForModuleOption(Guid userId, Guid moduleId, Guid moduleOptionId);
        Task UnVote(Guid userId, Guid moduleId);
    }
}