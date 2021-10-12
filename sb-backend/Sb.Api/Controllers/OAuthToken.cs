
using Newtonsoft.Json;

using System;

namespace Sb.Api.Controllers
{
    public class OAuthToken
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
        [JsonProperty("issued_utc")]
        public DateTimeOffset? IssuedUtc { get; set; }
        [JsonProperty("expires_utc")]
        public DateTimeOffset? ExpiresUtc { get; set; }
    }
}
