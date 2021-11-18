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
    }
}
