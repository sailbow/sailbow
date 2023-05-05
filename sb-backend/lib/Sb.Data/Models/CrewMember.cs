using System.ComponentModel.DataAnnotations.Schema;

namespace Sb.Data.Models
{
    [PersistenceModel("CrewMembers")]
    [Table("CrewMembers")]
    public class CrewMember : EntityBase
    {
        public string BoatId { get; set; }
        public string UserId { get; set; }
        public Role Role { get; set; }
        public string Info { get; set; }
        public string Email { get; set; }
        public User User { get; set; }
        public Boat Boat { get; set; }
    }
}
