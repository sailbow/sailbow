using System.Security.Claims;
using System.Xml.Linq;

using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

using Sb.Api.Authorization;
using Sb.Api.Configuration;
using Sb.Data;
using Sb.Data.Models.Mongo;
using Sb.Email;
using Sb.Email.Models;

namespace Sb.Api.Services
{
    public class EmailService
    {
        private readonly IRepository<Boat> _boatRepo;
        private readonly IRepository<Invite> _inviteRepo;

        private readonly HttpContext _httpContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEmailClient _emailClient;

        private readonly EmailConfig _emailConfig;
        private readonly SbApiConfig _sbApiConfig;

        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IRepository<Boat> boatRepo,
            IRepository<Invite> inviteRepo,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authorizationService,
            IEmailClient emailClient,
            IOptions<EmailConfig> emailConfig,
            IOptions<SbApiConfig> sbApiConfig,
            ILogger<EmailService> logger)
        {
            _boatRepo = boatRepo;
            _inviteRepo = inviteRepo;
            _httpContext = contextAccessor.HttpContext;
            _authorizationService = authorizationService;
            _emailClient = emailClient;
            _emailConfig = emailConfig.Value;
            _sbApiConfig = sbApiConfig.Value;
            _logger = logger;
        }

        public async Task SendBoatInvitations(string boatId, IEnumerable<Invite> invites)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.Null(invites, nameof(invites));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));

            var authResult = await _authorizationService.AuthorizeAsync(_httpContext.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            List<Task> inviteTasks = new();
            foreach (Invite invite in invites)
            {
                Invite duplicate = (await _inviteRepo.GetAsync(i => i.Email == invite.Email && i.BoatId == boatId))?.FirstOrDefault();

                if (duplicate != null)
                    await _inviteRepo.DeleteAsync(duplicate);
                    
                inviteTasks.Add(SendInvitationAsync(invite, boat));
            }

            await Task.WhenAll(inviteTasks);
        }

        private async Task SendInvitationAsync(Invite invite, Boat boat)
        {
            string inviteUrl = $"{_sbApiConfig.BoatInviteBaseUrl}/boats/{invite.BoatId}/invite?inviteId={invite.Id}";

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
