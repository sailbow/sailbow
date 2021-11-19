
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

using Sb.Data.Models;
using Sb.Data.Models.Mongo;

namespace Sb.Data.Mongo
{
    public class MongoRepository<TEntity> : IRepository<TEntity> where TEntity : MongoEntityBase
    {
        private readonly IMongoCollection<TEntity> _collection;

        public MongoRepository(MongoConfiguration config)
        {
            var attributes = (MongoCollectionAttribute[])Attribute.GetCustomAttributes(typeof(TEntity), typeof(MongoCollectionAttribute));
            if (attributes.Length == 0)
                throw new ArgumentException($"Cannot initialize MongoRepository with entity '{typeof(TEntity)}': missing MongoCollectionAttribute");

            var conventionPack = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("camelCase", conventionPack, t => true);

            MongoClient client = new(config.ConnectionString);
            _collection = client
                .GetDatabase(config.DatabaseName)
                .GetCollection<TEntity>(attributes[0].Name);
        }

        public async Task<IEnumerable<TEntity>> GetAsync(Func<TEntity, bool> predicate, CancellationToken cancellation = default)
        {
            return await Task.FromResult(_collection.AsQueryable().Where(predicate));
        }

        public async Task<TEntity> GetByIdAsync(string id, CancellationToken cancellation = default)
        {
            return (await _collection.FindAsync(e => e.Id.Equals(id), cancellationToken: cancellation))
                .FirstOrDefault();
        }

        public async Task<TEntity> InsertAsync(TEntity element, CancellationToken cancellation = default)
        {
            await _collection.InsertOneAsync(element, null, cancellation);
            return element;
        }

        public Task UpdateAsync(TEntity element, CancellationToken cancellation = default)
        {
            return _collection.ReplaceOneAsync(e => e.Id == element.Id, element, cancellationToken: cancellation);

        }

        public Task DeleteAsync(TEntity element, CancellationToken cancellation = default)
        {
            return _collection.DeleteOneAsync(e => e.Id == element.Id, cancellation);
        }
    }
}
