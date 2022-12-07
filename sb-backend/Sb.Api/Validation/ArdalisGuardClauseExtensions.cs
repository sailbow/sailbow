using Microsoft.AspNetCore.Authorization;

using Sb.Api.Validation;

namespace Ardalis.GuardClauses
{
    public static class ArdalisGuardClauseExtensions
    {
        public static void EntityMissing<TEntity>(this IGuardClause guardClause, TEntity entity, string parameterName)
        {
            if (entity is null)
                throw new MissingEntityException($"Entity '{parameterName}' is missing");
        }

        public static void EntityMissing<TEntity>(this IGuardClause guardClause, TEntity entity, string message, string parameterName = null)
        {
            if (entity is null)
            {
                throw string.IsNullOrWhiteSpace(parameterName)
                    ? new MissingEntityException(message)
                    : new MissingEntityException($"{parameterName}: {message}");
            }
        }

        public static void Forbidden(this IGuardClause guardClause, AuthorizationResult authResult)
        {
            if (!authResult.Succeeded)
                throw new ForbiddenResourceException();
        }
    }
}
