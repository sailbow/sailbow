using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sb.Email.Models
{
    public class EmailMessage
    {
        public string? From { get; set; }
        public IEnumerable<string> To { get; set; } = Enumerable.Empty<string>();
        public IEnumerable<string> Cc { get; set; } = Enumerable.Empty<string>();
        public IEnumerable<string> Bcc { get; set; } = Enumerable.Empty<string>();
        public string? Subject { get; set; }
        public string? Body { get; set; }
    }
}
