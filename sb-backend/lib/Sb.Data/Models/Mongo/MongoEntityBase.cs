
using MongoDB.Bson;

using Newtonsoft.Json;

namespace Sb.Data.Models.Mongo
{
    [JsonObject(MemberSerialization.OptOut)]
    public class MongoEntityBase : EntityBase
    {
        public override string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    }
}
