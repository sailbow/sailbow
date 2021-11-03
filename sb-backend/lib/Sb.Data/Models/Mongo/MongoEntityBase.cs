using MongoDB.Bson.Serialization.Attributes;

namespace Sb.Data.Models.Mongo
{
    public class MongoEntityBase : EntityBase
    {
        [BsonId]
        public override string Id { get; set; }
        protected MongoEntityBase() { }
    }
}
