using System;

namespace Sb.OAuth2
{
    public record AuthorizationParameters(Uri RedirectUri, string Scope, string AccessType);
}
