using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sb.Email.Models
{
    public record Address(string Email, string? Name = null);
    public class EmailMessage
    {
        public Address? From { get; set; }
        public IEnumerable<Address> To { get; set; } = Enumerable.Empty<Address>();
        public IEnumerable<Address> Cc { get; set; } = Enumerable.Empty<Address>();
        public IEnumerable<Address> Bcc { get; set; } = Enumerable.Empty<Address>();
        public string? Subject { get; set; }
        public string? Body { get; set; }
    }
}
