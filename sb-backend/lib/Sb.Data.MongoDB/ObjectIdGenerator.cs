using MongoDB.Bson;

namespace Sb.Data.MongoDB
{
    public class ObjectIdGenerator : IIdGenerator
    {
        public string GenerateId()
        {
            return ObjectId.GenerateNewId().ToString();
        }
    }
}
