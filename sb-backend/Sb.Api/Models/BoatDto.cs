using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class BoatDto : Boat
    {
        public Role Role { get; set; }
        public IEnumerable<Module> Modules { get; set; }
    }
}
