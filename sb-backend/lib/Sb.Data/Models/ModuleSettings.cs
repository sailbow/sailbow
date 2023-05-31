using System;

namespace Sb.Data.Models
{
    public class ModuleSettings : EntityBase
    {
        public bool AllowMultiple { get; set; }
        public bool AnonymousVoting { get; set; }
        public DateTime? Deadline { get; set; }
        public Guid ModuleId { get; set; }
        public Module Module { get; set; }
    }
}
