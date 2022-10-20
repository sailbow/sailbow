using System;

using Newtonsoft.Json;

namespace Sb.Data.Models
{
    [PersistenceModel("Users")]
    public class User : EntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Provider { get; set; }
        public string ProviderUserId { get; set; }
        [JsonIgnore]
        public string Hash { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}
