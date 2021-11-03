using System;

namespace Sb.Data.Models.Mongo
{
    [MongoCollection("Users")]
    public class User : MongoEntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Provider { get; set; }
        public string ProviderUserId { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}
