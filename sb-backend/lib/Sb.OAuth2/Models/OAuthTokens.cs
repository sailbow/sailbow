namespace Sb.OAuth2
{
    public class OAuthTokens
    {
        internal OAuthTokens() { }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string IdToken { get; set; }
        public int? ExpiresIn { get; set; }
        public string Scope { get; set; }
        public string TokenType { get; set; }
    }
}
