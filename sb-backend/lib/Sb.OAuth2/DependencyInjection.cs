
using Sb.OAuth2;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddGoogleOAuth2Client(this IServiceCollection services, ClientCredentials credentials)
            => services.AddTransient(provider => new GoogleOAuth2Client(credentials));

        public static IServiceCollection AddFacebookOAuth2Client(this IServiceCollection services, ClientCredentials credentials)
            => services.AddTransient(provider => new FacebookOAuth2Client(credentials));
    }
}
