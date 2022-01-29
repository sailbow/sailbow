using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Sb.Data.Models.Mongo
{
    public enum TokenType
    {
        Access,
        Refresh
    }

    [MongoCollection("Tokens")]
    public class TokenBase : MongoEntityBase
    {
        public string Value { get; set; }
        public DateTime Expires { get; set; }
        [BsonRepresentation(BsonType.String)]
        public TokenType Type { get; set; }
        public string UserId { get; set; }
    }
}
