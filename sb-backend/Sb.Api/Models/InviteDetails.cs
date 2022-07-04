using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class InviteDetails
    {
        public string Id { get; set; }
        public string BoatName { get; set; }
        public Banner Banner { get; set; }
        public CrewMemberWithUserInfo Captain { get; set; }
    }
}
