using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

using Sb.Api.Configuration;
using Sb.Data;
using Sb.Data.Models;
using Sb.Email;
using Sb.Email.Models;

namespace Sb.Api.Services
{
    public class EmailService
    {
        private readonly SbContext _db;

        private readonly HttpContext _httpContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEmailClient _emailClient;

        private readonly EmailConfig _emailConfig;
        private readonly SbApiConfig _sbApiConfig;

        private readonly ILogger<EmailService> _logger;

        public EmailService(
            SbContext db,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authorizationService,
            IEmailClient emailClient,
            IOptions<EmailConfig> emailConfig,
            IOptions<SbApiConfig> sbApiConfig,
            ILogger<EmailService> logger)
        {
            _db = db;
            _httpContext = contextAccessor.HttpContext;
            _authorizationService = authorizationService;
            _emailClient = emailClient;
            _emailConfig = emailConfig.Value;
            _sbApiConfig = sbApiConfig.Value;
            _logger = logger;
        }

        public async Task SendBoatInvitations(Guid boatId, IEnumerable<Invite> invites)
        {
            Guard.Against.Null(invites, nameof(invites));

            Boat boat = await _db.Boats.FindAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));

            foreach (Invite invite in invites)
            {
                await SendInvitationAsync(invite, boat);
            }
        }

        private async Task SendInvitationAsync(Invite invite, Boat boat)
        {
            string inviteUrl = $"{_sbApiConfig.BoatInviteBaseUrl}/invite?inviteId={invite.Id}&boatId={invite.BoatId}";

            _logger.LogInformation("Sending email invite with url '{inviteUrl}'", inviteUrl);
            await _emailClient.SendEmailAsync(new EmailMessage
            {
                From = new Address(_emailConfig.From, _emailConfig.Name),
                To = new List<Address> { new Address(invite.Email) },
                Subject = "You've been invited to a Boat!",
                Body = $"Captain {_httpContext.GetUserFromClaims().Name} has invited you to the boat {boat.Name}! Click <a href=\"{inviteUrl}\">here</a> to accept."
            });
        }
    }
}
