namespace Sb.OAuth2
{
    public class ParameterKeys
    {
        internal ParameterKeys() { }
        public string ClientId { get; set; } = "client_id";
        public string ClientSecret { get; set; } = "client_secret";
        public string Code { get; set; } = "code";
        public string State { get; set; } = "state";
        public string RedirectUri { get; set; } = "redirect_uri";
        public string GrantType { get; set; } = "grant_type";
        public string RefreshToken { get; set; } = "refresh_token";
        public string ResponseType { get; set; } = "response_type";
    }
}
