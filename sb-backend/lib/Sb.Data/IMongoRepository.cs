
using Sb.Data.Models.Mongo;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sb.Data
{
    public interface IMongoRepository<TEntity> where TEntity: MongoEntityBase
    {
        Task<TEntity> GetByIdAsync(string id);
        Task<IEnumerable<TEntity>> GetAsync(Func<TEntity, bool> predicate = null);
        Task<TEntity> InsertAsync(TEntity element);
        Task UpdateAsync(TEntity element);
        Task DeleteAsync(TEntity element);
    }
}
