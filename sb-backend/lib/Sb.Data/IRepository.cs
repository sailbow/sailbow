
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

using Sb.Data.Models;

namespace Sb.Data
{
    public interface IRepository<TEntity> where TEntity : EntityBase
    {
        Task<TEntity> GetByIdAsync(string id, CancellationToken cancellation = default);
        Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default);
        Task<IEnumerable<TEntity>> GetPaginatedAsync(int skip, int take, Expression<Func<TEntity, bool>> predicate,  CancellationToken cancellation = default);
        Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default);
        Task<TEntity> InsertAsync(TEntity element, CancellationToken cancellation = default);
        Task InsertManyAsync(IEnumerable<TEntity> entities, CancellationToken cancellation = default);
        Task UpdateAsync(TEntity element, CancellationToken cancellation = default);
        Task DeleteAsync(TEntity element, CancellationToken cancellation = default);
    }
}
