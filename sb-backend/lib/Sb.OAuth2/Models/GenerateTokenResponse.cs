using Newtonsoft.Json;

namespace Sb.OAuth2
{
    public class GenerateTokenResponse : TokenResponseBase
    {
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
    }
}
