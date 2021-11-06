using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Newtonsoft.Json;

using RestSharp;

namespace Sb.OAuth2
{
    public class FacebookOAuth2Client : OAuth2Client
    {
        public FacebookOAuth2Client(ClientCredentials credentials) : base(
            new Uri("https://www.facebook.com/v12.0/dialog/oauth"),
            new Uri("https://graph.facebook.com/v12.0/oauth/access_token"),
            new Uri("https://graph.facebook.com/v12.0/oauth/access_token"),
            credentials)
        {
            Defaults.Scope = "public_profile";
        }

        public override async Task<AuthorizedUser> GetAuthorizedUserAsync(string token)
        {
            var client = new RestClient("https://graph.facebook.com/me");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET)
                .AddQueryParameter("access_token", token)
                .AddQueryParameter("fields", "id,name,email,picture");

            IRestResponse res = await client.ExecuteAsync(request);
            EnsureSuccess(res);
            return JsonConvert.DeserializeObject<FacebookUserInfo>(res.Content, SerializerSettings);
        }
    }
}
