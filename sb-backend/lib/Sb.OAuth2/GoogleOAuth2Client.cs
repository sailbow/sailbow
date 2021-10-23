using System;
using System.Threading.Tasks;

using Newtonsoft.Json;

using RestSharp;

namespace Sb.OAuth2
{
    public class GoogleOAuth2Client : OAuth2Client
    {
        public GoogleOAuth2Client(ClientCredentials credentials): base(
            new Uri("https://accounts.google.com/o/oauth2/v2/auth"),
            new Uri("https://www.googleapis.com/oauth2/v4/token"),
            new Uri("https://www.googleapis.com/oauth2/v4/token"),
            credentials)
        {
        }

        public async Task<GoogleUserInfo> GetUserInfo(string authToken)
        {
            var client = new RestClient("https://www.googleapis.com/oauth2/v3/userinfo");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET)
                .AddHeader("Authorization", $"Bearer {authToken}");

            IRestResponse res = await client.ExecuteAsync(request);
            if (!res.IsSuccessful)
            {
                throw new OAuth2Exception(res.StatusCode, res.Content);
            }
            return JsonConvert.DeserializeObject<GoogleUserInfo>(res.Content);
        }
    }
}
