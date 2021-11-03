using System;
using System.Net;

namespace Sb.OAuth2
{
    public class OAuth2Exception : Exception
    {
        public HttpStatusCode StatusCode { get; }
        public string Content { get; }
        internal OAuth2Exception(HttpStatusCode code, string content) : base()
        {
            StatusCode = code;
            Content = content;
        }
    }
}
