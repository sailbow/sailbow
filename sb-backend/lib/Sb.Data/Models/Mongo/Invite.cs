namespace Sb.Data.Models.Mongo
{
    [MongoCollection("Invites")]
    public class Invite : MongoEntityBase
    {
        public string InviterId { get; set; }
        public string BoatId { get; set; }
        public string Email { get; set; }
        public Role Role { get; set; } = Role.Sailor;
    }
}
