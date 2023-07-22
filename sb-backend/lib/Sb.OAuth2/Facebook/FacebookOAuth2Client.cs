using System;
using System.Threading.Tasks;

using Newtonsoft.Json;

using RestSharp;
using RestSharp.Authenticators.OAuth2;

namespace Sb.OAuth2
{
    public class FacebookOAuth2Client : OAuth2Client
    {
        public FacebookOAuth2Client(ClientCredentials credentials) : base(
            new Uri("https://www.facebook.com/v17.0/dialog/oauth"),
            new Uri("https://graph.facebook.com/v17.0/oauth/access_token"),
            new Uri("https://graph.facebook.com/v17.0/oauth/access_token"),
            credentials)
        {
            Defaults.Scope = "public_profile";
        }

        public override async Task<AuthorizedUser> GetAuthorizedUserAsync(string token)
        {
            IRestClient client = CreateFacebookClient("https://graph.facebook.com", token);
            RestRequest request = new RestRequest("me", Method.Get)
                .AddQueryParameter("fields", "id,name,email,picture");

            RestResponse res = await client.ExecuteAsync(request);
            EnsureSuccess(res);
            return JsonConvert.DeserializeObject<FacebookUserInfo>(res.Content, SerializerSettings);
        }

        public override Task RevokeTokenAsync(string token)
        {
            return Task.CompletedTask;
        }

        private IRestClient CreateFacebookClient(string baseUrl, string token)
        {
            RestClientOptions options = new(baseUrl)
            {
                MaxTimeout = TimeSpan.FromSeconds(60).Milliseconds,
            };

            return new RestClient(options)
                .AddDefaultQueryParameter("access_token", token);
        }
    }
}
