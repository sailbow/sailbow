using System.Security.Claims;

using Sb.Data.Models.Mongo;

namespace Sb.Api.Authorization
{
    public class CaptainAuthorizationHandler : AuthorizationHandlerBase<CaptainRequirement, Boat>
    {
        protected override Task<bool> IsAuthorizedAsync(ClaimsPrincipal user, Boat resource)
        {
            string userId = user.Claims
                .FirstOrDefault(c => c.Type == CustomClaimTypes.Id)?.Value;
            CrewMember captain = resource.Crew.FirstOrDefault(cm => cm.Role == Role.Captain);
            return Task.FromResult(captain?.UserId == userId);
        }
    }
}
