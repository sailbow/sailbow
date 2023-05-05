using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Sb.Data.Models
{
    [PersistenceModel("Boats")]
    [Table("Boats")]
    public class Boat : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Banner Banner { get; set; }
        public Code Code { get; set; }
        public IEnumerable<CrewMember> Crew { get; set; } = Enumerable.Empty<CrewMember>();

        public bool Show { get; set; } = false;

        public CrewMember Captain => Crew.FirstOrDefault(cm => cm.Role == Role.Captain);
    }
}
