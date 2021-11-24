using System;

namespace Sb.Data.Models.Mongo
{
    [MongoCollection("BlacklistedTokens")]
    public class BlacklistedToken : MongoEntityBase
    {
        public string Value { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
