
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Sb.Data.Models.Mongo
{
    [MongoCollection("Invites")]
    public class Invite : MongoEntityBase
    {
        public string BoatId { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; } = Role.Sailor;
    }
}
