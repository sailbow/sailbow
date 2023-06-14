using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class BoatDto : Boat
    {
        public BoatRole Role { get; set; }
    }
}
