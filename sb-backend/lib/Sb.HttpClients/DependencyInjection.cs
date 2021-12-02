using Sb.HttpClients.Images;
using Sb.HttpClients.Images.Unsplash;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static SbHttpClients AddSbHttpClients(this IServiceCollection services)
        => new SbHttpClients(services);

    public class SbHttpClients
    {
        private readonly IServiceCollection _services;
        internal SbHttpClients(IServiceCollection services)
        {
            _services = services;
        }

        public void AddUnsplash(Action<UnsplashApiConfiguration> configureAction)
        {
            UnsplashApiConfiguration config = new();
            configureAction(config);
            _services.AddSingleton(config)
                .AddTransient<IImageClient, UnsplashApiClient>();
        }
    }
}

