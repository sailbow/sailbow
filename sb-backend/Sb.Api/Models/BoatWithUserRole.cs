using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class BoatWithUserRole : Boat
    {
        public Role Role { get; set; }
    }
}
