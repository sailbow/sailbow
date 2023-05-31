using System;
namespace Sb.Data.Models
{
    [PersistenceModel("Invites")]
    public class Invite : EntityBase
    {
        public Guid InviterId { get; set; }
        public Guid BoatId { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; } = Role.Sailor;
    }
}
