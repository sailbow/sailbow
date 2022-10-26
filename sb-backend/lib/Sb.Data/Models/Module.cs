using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sb.Data.Models
{
    [PersistenceModel("Modules")]
    public class Module : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public int? FinalizedOptionId { get; set; }
        public ModuleSettings Settings { get; set; }
        public List<ModuleData> Data { get; set; } = new List<ModuleData>();

    }
    public class ModuleSettings
    {
        public bool AllowMultiple { get; set; }
        public bool AnonymousVoting { get; set; }
        public DateTime? Deadline { get; set; }
    }
    public class ModuleData : EntityBase
    {
        public List<string> Votes { get; set; } = new List<string>();
        public string Author { get; set; }
    }
}
