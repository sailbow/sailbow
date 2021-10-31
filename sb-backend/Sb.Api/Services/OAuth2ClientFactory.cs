using System;

using Microsoft.Extensions.DependencyInjection;

using Sb.Api.Models;
using Sb.OAuth2;

namespace Sb.Api.Services
{
    public class OAuth2ClientFactory
    {
        private readonly IServiceProvider _serviceProvider;
        public OAuth2ClientFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public OAuth2Client GetClient(IdentityProvider provider)
        {
            switch (provider)
            {
                case IdentityProvider.Google: return _serviceProvider.GetRequiredService<GoogleOAuth2Client>();
                case IdentityProvider.Facebook: return _serviceProvider.GetRequiredService<FacebookOAuth2Client>();
                default: throw new ArgumentException("Unsupported OAuth2 provider");
            }
        }
    }
}
