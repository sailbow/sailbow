using System.Security.Claims;

using Sb.Data.Models;

namespace Sb.Api.Authorization
{
    public class CrewMemberAuthorizationHandler : AuthorizationHandlerBase<CrewMemberRequirement, Boat>
    {
        protected override Task<bool> IsAuthorizedAsync(ClaimsPrincipal user, Boat resource)
        {
            string userId = user.Claims
                .FirstOrDefault(c => c.Type == CustomClaimTypes.Id)?.Value;
            return Task.FromResult(resource.Crew.Any(cm => cm.UserId == userId));
        }
    }
}
