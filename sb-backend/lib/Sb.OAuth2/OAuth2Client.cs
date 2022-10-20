using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using RestSharp;

namespace Sb.OAuth2
{
    public class OAuth2Defaults
    {
        public string Scope { get; set; }
        public string AccessType { get; set; }
    }

    public abstract class OAuth2Client
    {
        public ParameterKeys ParameterKeys { get; } = new();

        protected OAuth2Defaults Defaults { get; set; } = new()
        {
            Scope = "id",
            AccessType = "offline"
        };

        protected JsonSerializerSettings SerializerSettings { get; set; } = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver { NamingStrategy = new SnakeCaseNamingStrategy() }
        };

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

        public virtual string GetAuthorizationEndpoint(string redirectUri, string scope = null, string accessType = null, string state = null)
        {
            string endpoint =
                $"{_authUrl}?{ParameterKeys.RedirectUri}={redirectUri}&{ParameterKeys.ClientId}={_clientCredentials.ClientId}&state={state}&scope={scope ?? Defaults.Scope}&access_type={accessType ?? Defaults.AccessType}&{ParameterKeys.ResponseType}=code";
            foreach (KeyValuePair<string, string> kvp in GetAdditionalAuthorizationParameters())
            {
                endpoint += $"&{kvp.Key}={kvp.Value}";
            }
            return endpoint;
        }

        public async Task<OAuthTokens> GenerateAccessTokensAsync(string authCode, string redirectUri, string state)
        {
            var client = new RestClient(_tokenUrl);
            client.Timeout = -1;
            var request = new RestRequest(Method.POST)
                .AddHeader("Content-Type", "application/x-www-form-urlencoded")
                .AddParameter(ParameterKeys.Code, authCode)
                .AddParameter(ParameterKeys.RedirectUri, redirectUri)
                .AddParameter(ParameterKeys.State, state)
                .AddParameter(ParameterKeys.ClientId, _clientCredentials.ClientId)
                .AddParameter(ParameterKeys.ClientSecret, _clientCredentials.ClientSecret)
                .AddParameter(ParameterKeys.GrantType, "authorization_code");
            IRestResponse res = await client.ExecuteAsync(request);
            if (!res.IsSuccessful)
            {
                throw new OAuth2Exception(res.StatusCode, res.Content);
            }
            return JsonConvert.DeserializeObject<OAuthTokens>(res.Content, SerializerSettings);
        }

        public async Task<OAuthTokens> RefreshTokenAsync(string refreshToken)
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
            return JsonConvert.DeserializeObject<OAuthTokens>(res.Content, SerializerSettings);
        }

        public abstract Task<AuthorizedUser> GetAuthorizedUserAsync(string accessToken);
        public abstract Task RevokeTokenAsync(string token);

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
