using Newtonsoft.Json;

namespace Sb.OAuth2
{
    public class GenerateTokenResponse : TokenResponseBase
    {
        public string RefreshToken { get; set; }
    }
}
