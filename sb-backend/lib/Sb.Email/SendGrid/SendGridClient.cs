using Sb.Email.Models;

using SendGrid;
using SendGrid.Helpers.Mail;

namespace Sb.Email.SendGrid
{
    public class SendGridClient : IEmailClient
    {
        private readonly ISendGridClient _sendGridClient;

        public SendGridClient(ISendGridClient client)
        {
            _sendGridClient = client;
        }

        public async Task SendEmailAsync(EmailMessage email)
        {
            SendGridMessage message = MailHelper.CreateSingleEmailToMultipleRecipients(
                new EmailAddress(email?.From?.Email, email?.From?.Name),
                email?.To.Select(to => new EmailAddress(to.Email, to.Name)).ToList(),
                email?.Subject,
                plainTextContent: null,
                htmlContent: email?.Body);

            await _sendGridClient.SendEmailAsync(message);
        }
    }
}
