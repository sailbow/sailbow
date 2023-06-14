using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class InviteDetails
    {
        public string Id { get; set; }
        public string BoatName { get; set; }
        public string InvitedByUserName { get; set; }
        public string InvitedByUserEmail { get; set; }
    }
}
