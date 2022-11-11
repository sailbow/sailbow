
using System.Linq.Expressions;
using System.Reflection;

using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

using Sb.Data.Models;

namespace Sb.Data.MongoDB
{
    public class MongoRepository : IRepository
    {
        public MongoRepository(MongoConfiguration config)
        {
            if (config is null
                || string.IsNullOrWhiteSpace(config.ConnectionString)
                || string.IsNullOrWhiteSpace(config.DatabaseName))
            {
                throw new ArgumentException("Invalid MongoConfiguration");
            }

            _config = config;
        }

        public async Task<IEnumerable<TEntity>> GetAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
             where TEntity : EntityBase
        {
            return await Connect<TEntity>()
                .AsQueryable()
                .Where(predicate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetPaginatedAsync<TEntity>(int skip, int take, Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            return await Connect<TEntity>()
                .AsQueryable()
                .Where(predicate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<TEntity> FirstOrDefaultAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            var results = await GetAsync(predicate, cancellation);
            return results.FirstOrDefault();
        }

        public Task<TEntity> GetByIdAsync<TEntity>(string id, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            return FirstOrDefaultAsync<TEntity>(e => e.Id == id, cancellation);
        }

        public async Task<TEntity> InsertAsync<TEntity>(TEntity element, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            await Connect<TEntity>().InsertOneAsync(element, null, cancellation);
            return element;
        }

        public async Task InsertManyAsync<TEntity>(IEnumerable<TEntity> entities, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            await Connect<TEntity>().InsertManyAsync(entities, null, cancellationToken: cancellation);
        }

        public Task UpdateAsync<TEntity>(TEntity element, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            return Connect<TEntity>()
                .ReplaceOneAsync(e => e.Id == element.Id, element, cancellationToken: cancellation);
        }

        public Task DeleteAsync<TEntity>(TEntity element, CancellationToken cancellation = default)
            where TEntity : EntityBase
        {
            return Connect<TEntity>().DeleteOneAsync(e => e.Id == element.Id, cancellation);
        }

        private IMongoCollection<TEntity> Connect<TEntity>()
            where TEntity : EntityBase
        {
            var attributes = (PersistenceModelAttribute[])Attribute.GetCustomAttributes(typeof(TEntity), typeof(PersistenceModelAttribute));
            if (attributes.Length == 0)
                throw new ArgumentException($"Cannot connect to collection for entity '{typeof(TEntity)}': missing MongoCollectionAttribute");

            return new MongoClient(_config.ConnectionString)
                .GetDatabase(_config.DatabaseName)
                .GetCollection<TEntity>(attributes[0].Name);
        }

        private readonly MongoConfiguration _config;
    }
}
