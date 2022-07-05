namespace Sb.Data.Models
{
    [PersistenceModel("Invites")]
    public class Invite : EntityBase
    {
        public string InviterId { get; set; }
        public string BoatId { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; } = Role.Sailor;
    }
}
