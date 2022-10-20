using System;

namespace Sb.Data.Models
{
    [PersistenceModel("Tokens")]
    public class TokenBase : EntityBase
    {
        public string Value { get; set; }
        public DateTime Expires { get; set; }
        public TokenType Type { get; set; }
        public string UserId { get; set; }
    }
}
