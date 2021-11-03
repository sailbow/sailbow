
using MongoDB.Driver;

using Sb.Data.Models.Mongo;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sb.Data.Mongo
{
    public class MongoRepository<TMongoEntity> : IMongoRepository<TMongoEntity> where TMongoEntity : MongoEntityBase
    {
        private readonly IMongoCollection<TMongoEntity> _collection;

        internal MongoRepository(MongoConfiguration config)
        {
            var attributes = (MongoCollectionAttribute[])Attribute.GetCustomAttributes(GetType().Assembly, typeof(MongoCollectionAttribute));
            if (attributes.Length == 0)
                throw new ArgumentException($"Cannot initialize MongoRepository '{GetType().FullName}': missing MongoCollectionAttribute");

            MongoClient client = new(config.ConnectionString);
            _collection = client
                .GetDatabase(config.DatabaseName)
                .GetCollection<TMongoEntity>(attributes[0].Name);
        }

        public Task<IEnumerable<TMongoEntity>> GetAsync(Func<TMongoEntity, bool> predicate)
        {
            return Task.FromResult(_collection.AsQueryable().Where(predicate));
        }

        public async Task<TMongoEntity> GetByIdAsync(string id)
        {
            return (await _collection.FindAsync(e => e.Id.Equals(id)))
                .FirstOrDefault();
        }

        public async Task<TMongoEntity> InsertAsync(TMongoEntity element)
        {
            await _collection.InsertOneAsync(element);
            return element;
        }

        public Task UpdateAsync(TMongoEntity element)
        {
            return _collection.ReplaceOneAsync(e => e.Id == element.Id, element);

        }

        public Task DeleteAsync(TMongoEntity element)
        {
            return _collection.DeleteOneAsync(e => e.Id == element.Id);
        }
    }
}
