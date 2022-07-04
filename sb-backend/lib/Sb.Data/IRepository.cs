
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Sb.Data
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity> GetByIdAsync(string id, CancellationToken cancellation = default);
        Task<IEnumerable<TEntity>> GetAsync(Func<TEntity, bool> predicate = null, CancellationToken cancellation = default);
        Task<TEntity> FirstOrDefaultAsync(Func<TEntity, bool> predicate = null, CancellationToken cancellation = default);
        Task<TEntity> InsertAsync(TEntity element, CancellationToken cancellation = default);
        Task InsertManyAsync(IEnumerable<TEntity> entities, CancellationToken cancellation = default);
        Task UpdateAsync(TEntity element, CancellationToken cancellation = default);
        Task DeleteAsync(TEntity element, CancellationToken cancellation = default);
    }
}
