using System;
using System.Collections.Generic;
using System.Linq;

namespace Sb.Data.Models
{
    [PersistenceModel("Modules")]
    public class Module : EntityBase
    {
        public string BoatId { get; set; }
        public string Name { get; set; }
        public ModuleType Type { get; set; }
        public string Author { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public string FinalizedOptionId { get; set; }
        public ModuleSettings Settings { get; set; }
    }

    public class ModuleSettings
    {
        public bool AllowMultiple { get; set; }
        public bool AnonymousVoting { get; set; }
        public DateTime? Deadline { get; set; }
    }

    [PersistenceModel("ModuleData")]
    public abstract class ModuleData : EntityBase
    {
        public string ModuleId { get; set; }
        public int NumVotes { get; set; }
        public HashSet<string> Votes { get; set; } = new HashSet<string>();
        public string Author { get; set; }
    }

    public class DateModuleData : ModuleData
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class LocationModuleData : ModuleData
    {

    }

    public enum ModuleType
    {
        Date,
        Location
    }
}
