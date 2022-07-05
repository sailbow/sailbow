
using Newtonsoft.Json;

using Sb.Data.Models;

namespace Sb.Api.Models
{
    public class JwtTokensResponse
    {
        public TokenBase AccessToken { get; set; }
        public TokenBase RefreshToken { get; set; }
    }
}
