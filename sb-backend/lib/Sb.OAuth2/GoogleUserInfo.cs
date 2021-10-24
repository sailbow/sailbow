
using Newtonsoft.Json;

namespace Sb.OAuth2
{
    public class GoogleUserInfo
    {
        [JsonProperty("sub")]
        public string Id { get; set; }
        [JsonProperty("given_name")]
        public string FirstName { get; set; }
        [JsonProperty("family_name")]
        public string LastName { get; set; }
        [JsonProperty("email")]
        public string Email { get; set; }
    }
}
