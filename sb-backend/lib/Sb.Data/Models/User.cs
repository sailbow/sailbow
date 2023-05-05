using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;

namespace Sb.Data.Models
{
    [PersistenceModel("Users")]
    [Table("Users")]
    public class User : EntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Provider { get; set; }
        public string ProviderUserId { get; set; }
        [JsonIgnore]
        public string Hash { get; set; }
        public DateTime? DateCreated { get; set; }

        public IEnumerable<CrewMember> UserCrewMembers { get; set; } = Enumerable.Empty<CrewMember>();
    }
}
