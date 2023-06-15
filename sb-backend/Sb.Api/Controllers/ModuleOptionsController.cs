using System;

using Microsoft.AspNetCore.Mvc;

using Sb.Api.Services;
using Sb.Data.Models;

namespace Sb.Api.Controllers
{
    [Route("api/boats/{boatId}/modules/{moduleId}/options")]
    public class ModuleOptionsController : ApiControllerBase
    {
        public ModuleOptionsController(
            ModuleService moduleService)
        {
            _moduleService = moduleService;

        }

        [HttpPost]
        public async Task<ModuleOption> AddModuleOption(
        [FromRoute] Guid boatId,
        [FromRoute] Guid moduleId,
        [FromBody] ModuleOption moduleData)
        {
            moduleData.ModuleId = moduleId;
            moduleData.AuthorId = HttpContext.GetUserId();
            return await _moduleService.AddModuleOption(moduleData.AuthorId, moduleId, moduleData);
        }

        [HttpDelete("{optionId}")]
        public async Task DeleteModuleOption(Guid optionId)
        {
            await _moduleService.DeleteModuleOption(optionId);
        }

        private readonly ModuleService _moduleService;
    }
}