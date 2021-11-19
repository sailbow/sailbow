using System.Security.Claims;

using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Authorization;

namespace Sb.Api.Authorization
{
    public abstract class AuthorizationHandlerBase<TRequirement, TResource> : AuthorizationHandler<TRequirement, TResource> where TRequirement : IAuthorizationRequirement
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, TRequirement requirement, TResource resource)
        {
            Guard.Against.Null(resource, nameof(resource));
            Task<bool> task = IsAuthorizedAsync(context.User, resource);
            if (task.Result)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
        protected abstract Task<bool> IsAuthorizedAsync(ClaimsPrincipal user, TResource resource);
    }
}
