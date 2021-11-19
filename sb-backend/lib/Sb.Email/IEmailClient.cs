using Sb.Email.Models;

namespace Sb.Email
{
    public interface IEmailClient
    {
        Task SendEmailAsync(EmailMessage email);
    }
}