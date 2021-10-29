using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using RestSharp;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;

namespace Sb.OAuth2
{
    public abstract class OAuth2Client
    {
        public ParameterKeys ParameterKeys { get; } = new();
        private readonly Uri _authUrl;
        private readonly Uri _tokenUrl;
        private readonly Uri _tokenRefreshUrl;
        private readonly ClientCredentials _clientCredentials;
        internal OAuth2Client(Uri authUrl, Uri tokenUrl, Uri tokenRefreshUrl, ClientCredentials credentials)
        {
            _authUrl = authUrl;
            _tokenUrl = tokenUrl;
            _tokenRefreshUrl = tokenRefreshUrl;
            _clientCredentials = credentials;
        }

        public virtual string GetAuthorizationEndpoint(string scope, string redirectUri, string accessType = "offline")
        {
            string endpoint =
                $"{_authUrl}?{ParameterKeys.RedirectUri}={HttpUtility.UrlEncode(redirectUri)}&{ParameterKeys.ClientId}={_clientCredentials.ClientId}&scope={scope}&access_type={accessType}&{ParameterKeys.ResponseType}=code";
            foreach (KeyValuePair<string,string> kvp in GetAdditionalAuthorizationParameters())
            {
                endpoint += $"&{kvp.Key}={kvp.Value}";
            }
            return endpoint;
        }

        public async Task<GenerateTokenResponse> GenerateAccessTokensAsync(string authCode, string redirectUri)
        {
            var client = new RestClient(_tokenUrl);
            client.Timeout = -1;
            var request = new RestRequest(Method.POST)
                .AddHeader("Content-Type", "application/x-www-form-urlencoded")
                .AddParameter(ParameterKeys.Code, authCode)
                .AddParameter(ParameterKeys.RedirectUri, redirectUri)
                .AddParameter(ParameterKeys.ClientId, _clientCredentials.ClientId)
                .AddParameter(ParameterKeys.ClientSecret, _clientCredentials.ClientSecret)
                .AddParameter(ParameterKeys.GrantType, "authorization_code");
            IRestResponse res = await client.ExecuteAsync(request);
            if (!res.IsSuccessful)
            {
                throw new OAuth2Exception(res.StatusCode, res.Content);
            }
            return JsonConvert.DeserializeObject<GenerateTokenResponse>(res.Content, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver { NamingStrategy = new SnakeCaseNamingStrategy() }
            });
        }

        public async Task<RefreshTokenResponse> RefreshTokenAsync(string refreshToken)
        {
            var client = new RestClient(_tokenRefreshUrl);
            client.Timeout = -1;
            var request = new RestRequest(Method.POST)
                .AddHeader("Content-Type", "application/x-www-form-urlencoded")
                .AddParameter(ParameterKeys.RefreshToken, refreshToken)
                .AddParameter(ParameterKeys.ClientId, _clientCredentials.ClientId)
                .AddParameter(ParameterKeys.ClientSecret, _clientCredentials.ClientSecret)
                .AddParameter(ParameterKeys.GrantType, "refresh_token");

            IRestResponse res = await client.ExecuteAsync(request);
            if (!res.IsSuccessful)
            {
                throw new OAuth2Exception(res.StatusCode, res.Content);
            }
            return JsonConvert.DeserializeObject<RefreshTokenResponse>(res.Content);
        }

        protected virtual Dictionary<string, string> GetAdditionalAuthorizationParameters()
            => new();

        protected void EnsureSuccess(IRestResponse res)
        {
            if (!res.IsSuccessful)
            {
                throw new OAuth2Exception(res.StatusCode, res.Content);
            }
        }
    }
}
