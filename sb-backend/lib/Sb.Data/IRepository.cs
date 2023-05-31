
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

using Sb.Data.Models;

namespace Sb.Data
{
    public interface IRepository
    {
        Task<TEntity> GetByIdAsync<TEntity>(Guid id, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task<IEnumerable<TEntity>> GetAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task<IEnumerable<TEntity>> GetPaginatedAsync<TEntity>(int skip, int take, Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task<TEntity> FirstOrDefaultAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task<TEntity> InsertAsync<TEntity>(TEntity element, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task<IEnumerable<TEntity>> InsertManyAsync<TEntity>(IEnumerable<TEntity> entities, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task UpdateAsync<TEntity>(TEntity element, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task DeleteByIdAsync<TEntity>(Guid id, CancellationToken cancellation = default) where TEntity : EntityBase;
        Task DeleteAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default) where TEntity : EntityBase;
    }
}
