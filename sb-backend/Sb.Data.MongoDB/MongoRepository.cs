
using System.Linq.Expressions;
using System.Reflection;

using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

using Sb.Data.Models;

namespace Sb.Data.MongoDB
{
    public class MongoRepository<TEntity> : IRepository<TEntity> where TEntity : EntityBase
    {
        public IMongoCollection<TEntity> Collection { get; private set; }

        public MongoRepository(MongoConfiguration config)
        {
            if (config is null 
                || string.IsNullOrWhiteSpace(config.ConnectionString)
                || string.IsNullOrWhiteSpace(config.DatabaseName))
            {
                throw new ArgumentException("Invalid MongoConfiguration");
            }

            _config = config;

            ConventionRegistry.Register(
                name: "camelCase",
                conventions: new ConventionPack { new CamelCaseElementNameConvention() },
                filter: t => true);

            ConventionRegistry.Register(
                name: "stringObjectIds",
                conventions: new ConventionPack { new StringObjectIdConvention() },
                filter: testc => true);
        }

        public async Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
        {
            return await Connect()
                .Find(predicate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetPaginatedAsync(int skip, int take, Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
        {
            return await Connect()
                .Find(predicate)
                .Skip(skip)
                .Limit(take)
                .ToListAsync();
        }

        public async Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
        {
            return (await GetAsync(predicate, cancellation)).FirstOrDefault();
        }

        public Task<TEntity> GetByIdAsync(string id, CancellationToken cancellation = default)
        {
            return FirstOrDefaultAsync(e => e.Id.Equals(id), cancellation);
        }

        public async Task<TEntity> InsertAsync(TEntity element, CancellationToken cancellation = default)
        {
            await Connect().InsertOneAsync(element, null, cancellation);
            return element;
        }

        public async Task InsertManyAsync(IEnumerable<TEntity> entities, CancellationToken cancellation = default)
        {
            await Connect().InsertManyAsync(entities, cancellationToken: cancellation);
        }

        public Task UpdateAsync(TEntity element, CancellationToken cancellation = default)
        {
            return Connect()
                .ReplaceOneAsync(e => e.Id.Equals(element.Id), element, cancellationToken: cancellation);
        }

        public Task DeleteAsync(TEntity element, CancellationToken cancellation = default)
        {
            return Connect().DeleteOneAsync(e => e.Id.Equals(element.Id), cancellation);
        }

        private IMongoCollection<TEntity> Connect()
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
