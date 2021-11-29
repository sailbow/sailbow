using System.Security.Claims;

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

        private readonly HttpContext _httpContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEmailClient _emailClient;

        private readonly EmailConfig _emailConfig;

        public EmailService(
            IRepository<Boat> boatRepo,
            IHttpContextAccessor contextAccessor,
            IAuthorizationService authorizationService,
            IEmailClient emailClient,
            IOptions<EmailConfig> emailConfig)
        {
            _boatRepo = boatRepo;
            _httpContext = contextAccessor.HttpContext;
            _authorizationService = authorizationService;
            _emailClient = emailClient;
            _emailConfig = emailConfig.Value;
        }

        public async Task SendBoatInvitations(string boatId, IEnumerable<Invite> invites)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.Null(invites, nameof(invites));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));

            var authResult = await _authorizationService.AuthorizeAsync(_httpContext.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);

            string name = _httpContext.GetClaim(ClaimTypes.Name);
            foreach (Invite invite in invites)
            {
                await _emailClient.SendEmailAsync(new EmailMessage
                {
                    From = new Address(_emailConfig.From, _emailConfig.Name),
                    To = new List<Address> { new Address(invite.Email) },
                    Subject = "You've been invited to a Boat!",
                    Body = $"Captain {name} has invited you to the boat {boat.Name}! Click <a href=\"{_httpContext.GetHostUrl()}/boats/{boatId}?inviteId={invite.Id}\">here</a> to accept."
                });
            }
        }
    }
}
