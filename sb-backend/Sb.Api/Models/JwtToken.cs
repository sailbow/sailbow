using Newtonsoft.Json;

using System;

namespace Sb.Api.Models
{
    public class JwtToken
    {
        [JsonProperty("accessToken")]
        public string AccessToken { get; set; }
        [JsonProperty("expiresAt")]
        public DateTime? ExpiresAt { get; set; }
    }
}
