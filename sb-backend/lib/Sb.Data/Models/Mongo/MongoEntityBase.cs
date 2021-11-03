
using MongoDB.Bson;

namespace Sb.Data.Models.Mongo
{
    public class MongoEntityBase : EntityBase
    {
        public MongoEntityBase()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }
    }
}
