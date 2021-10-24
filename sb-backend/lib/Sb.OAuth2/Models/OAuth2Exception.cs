using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

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
