using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class LightWeightModule
    {
        public string Id { get; set; }
        public ModuleType Name { get; set; }
        public string Author { get; set; }
        public int Order { get; set; }
        public ModuleSettings Settings { get; set; }
    }
}
