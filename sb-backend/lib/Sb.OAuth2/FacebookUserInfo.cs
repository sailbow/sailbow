using Newtonsoft.Json;
namespace Sb.OAuth2
{
    public class FacebookUserInfo : AuthorizedUser
    {
        [JsonProperty("picture")]
        public FbPicture Picture { get; set; }
        public override string GetProfilePicture() => Picture?.Data?.Url;
    }

    public class FbPicture
    {
        public PictureData Data { get; set; }
    }

    public class PictureData
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public int IsSilhouette { get; set; }
        public string Url { get; set; }
    }
}
