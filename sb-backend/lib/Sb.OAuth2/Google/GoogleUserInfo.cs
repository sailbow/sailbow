
using Newtonsoft.Json;

namespace Sb.OAuth2
{
    public class GoogleUserInfo : AuthorizedUser
    {
        [JsonProperty("sub")]
        public override string Id { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Picture { get; set; }

        public override string GetProfilePicture() => Picture;
    }
}
