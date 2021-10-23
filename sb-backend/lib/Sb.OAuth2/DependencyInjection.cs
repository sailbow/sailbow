using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.DependencyInjection;

using Sb.OAuth2;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddGoogleOAuth2Client(this IServiceCollection services, ClientCredentials credentials)
            => services.AddTransient(provider => new GoogleOAuth2Client(credentials));
    }
}
