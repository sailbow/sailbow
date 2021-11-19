using SendGrid;
using SendGrid.Extensions.DependencyInjection;

using Microsoft.Extensions.DependencyInjection;

namespace Sb.Email
{
    public static class DependencyInjection
    {
        public class SbEmailClients
        {
            private readonly IServiceCollection _services;
            internal SbEmailClients(IServiceCollection services)
            {
                _services = services;
            }

            public void AddSendGridClient(Action<SendGridClientOptions> configureAction)
            {
                _services.AddSendGrid(configureAction);
                _services.AddTransient<IEmailClient, SendGrid.SendGridClient>();
            }
        }
    }
}
