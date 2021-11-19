using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RestSharp;

namespace Sb.OAuth2
{
    public class GoogleOAuth2Client : OAuth2Client
    {
        public GoogleOAuth2Client(ClientCredentials credentials) : base(
            new Uri("https://accounts.google.com/o/oauth2/v2/auth"),
            new Uri("https://www.googleapis.com/oauth2/v4/token"),
            new Uri("https://www.googleapis.com/oauth2/v4/token"),
            credentials)
        {
            Defaults.Scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
        }

        public override async Task<AuthorizedUser> GetAuthorizedUserAsync(string token)
        {
            var client = new RestClient("https://www.googleapis.com/oauth2/v3/userinfo");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET)
                .AddHeader("Authorization", $"Bearer {token}");

            IRestResponse res = await client.ExecuteAsync(request);
            EnsureSuccess(res);
            return JsonConvert.DeserializeObject<GoogleUserInfo>(res.Content, SerializerSettings);
        }

        public override async Task RevokeTokenAsync(string token)
        {
            RestClient client = new("https://oauth2.googleapis.com/revoke");
            var request = new RestRequest(Method.POST)
                .AddParameter("token", token)
                .AddHeader("Authorization", $"Bearer {token}");
            IRestResponse res = await client.ExecuteAsync(request);
        }
    }
}
