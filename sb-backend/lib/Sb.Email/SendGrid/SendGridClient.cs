using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            SendGridMessage message = new()
            {
                From = new EmailAddress(email.From),
                Subject = email.Subject,
                HtmlContent = email.Body
            };

            message.AddTos(email.To.Select(to => new EmailAddress(to)).ToList());
            message.AddCcs(email.Cc.Select(cc => new EmailAddress(cc)).ToList());
            message.AddBccs(email.Bcc.Select(bcc => new EmailAddress(bcc)).ToList());

            await _sendGridClient.SendEmailAsync(message);
        }
    }
}
