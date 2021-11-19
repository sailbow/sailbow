using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sb.Data.Models.Mongo
{
    [MongoCollection("BlacklistedTokens")]
    public class BlacklistedToken: MongoEntityBase
    {
        public string Value { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
