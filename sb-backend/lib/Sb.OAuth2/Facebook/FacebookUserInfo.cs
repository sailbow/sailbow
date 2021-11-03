using Newtonsoft.Json;
namespace Sb.OAuth2
{
    public class FacebookUserInfo : AuthorizedUser
    {
        [JsonProperty("picture")]
        public FbPicture FbPicture { get; set; }
        public override string GetProfilePicture() => FbPicture?.Data?.Url;
    }
}
