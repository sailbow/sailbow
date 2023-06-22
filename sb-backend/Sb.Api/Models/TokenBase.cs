using System;
namespace Sb.Api.Models
{
    public class TokenBase
    {
        public string Value { get; set; }
        public DateTime Expires { get; set; }
        public TokenType Type { get; set; }
        public Guid UserId { get; set; }
    }
}
