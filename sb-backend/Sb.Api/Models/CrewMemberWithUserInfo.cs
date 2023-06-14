using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class CrewMemberWithUserInfo
    {
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public BoatRole Role { get; set; }
    }
}
