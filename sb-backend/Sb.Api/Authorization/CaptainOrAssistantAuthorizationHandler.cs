using System.Security.Claims;

using Sb.Data.Models.Mongo;

namespace Sb.Api.Authorization
{

    public class CaptainOrAssistantAuthorizationHandler : AuthorizationHandlerBase<CaptainOrAssistantRequirement, Boat>
    {
        protected override Task<bool> IsAuthorizedAsync(ClaimsPrincipal user, Boat resource)
        {
            string userId = user.Claims
                .FirstOrDefault(c => c.Type == CustomClaimTypes.Id)?.Value;
            CrewMember crewMember = resource.Crew.FirstOrDefault(cm => cm.UserId == userId);
            return Task.FromResult(
                crewMember != null &&
                (crewMember.Role == Role.Captain || crewMember.Role == Role.Assistant));
        }
    }
}
