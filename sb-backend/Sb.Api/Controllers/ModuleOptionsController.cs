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
            IModuleService moduleService)
        {
            _moduleService = moduleService;

        }

        [HttpPost]
        public async Task<ModuleData> AddModuleOption(
        [FromRoute] string boatId,
        [FromRoute] string moduleId,
        [FromBody] ModuleData moduleData)
        {
            moduleData.ModuleId = moduleId;
            moduleData.Author = HttpContext.GetUserId();
            return await _moduleService.AddModuleData(moduleData);
        }

        [HttpDelete("{optionId}")]
        public async Task DeleteModuleOption(string optionId)
        {
            await _moduleService.DeleteModuleData(optionId);
        }

        private readonly IModuleService _moduleService;
    }
}