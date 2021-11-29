using Ardalis.GuardClauses;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using Sb.Api.Authorization;
using Sb.Api.Configuration;
using Sb.Api.Models;
using Sb.Api.Services;
using Sb.Data;
using Sb.Data.Models.Mongo;
using Sb.Email;
using Sb.Email.Models;

using System.Security.Claims;

namespace Sb.Api.Controllers
{
    public class BoatsController : ApiControllerBase
    {
        private readonly BoatService _boatService;
        private readonly IRepository<User> _userRepo;
        private readonly IEmailClient _emailClient;
        private readonly IAuthorizationService _authService;

        private readonly EmailConfig _emailConfig;
        private readonly SbApiConfig _apiConfig;

        public BoatsController(
            BoatService boatService,
            IRepository<User> userRepo,
            IEmailClient emailClient,
            IAuthorizationService authService,
            IOptions<EmailConfig> emailConfig,
            IOptions<SbApiConfig> apiConfig)
        {
            _boatService = boatService;
            _userRepo = userRepo;
            _emailClient = emailClient;
            _authService = authService;
            _emailConfig = emailConfig.Value;
            _apiConfig = apiConfig.Value;
        }

        [HttpPost("create")]
        public async Task<Boat> CreateBoat([FromBody] Boat boat)
        {
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            Guard.Against.NullOrWhiteSpace(id, nameof(id));

            boat.Crew = new List<CrewMember>
            {
                new CrewMember
                {
                    UserId = id,
                    Role = Role.Captain,
                    Info = string.Empty
                }
            };
            return await _boatService.CreateBoat(boat);
        }

        [HttpGet("{boatId}")]
        public Task<Boat> GetBoatById(string boatId)
            => _boatService.GetBoatById(boatId);

        [HttpPost("{boatId}/invites")]
        public async Task<IActionResult> SendBoatInvites(string boatId, [FromBody] IEnumerable<string> emails)
        {
            Boat boat = await _boatService.GetBoatById(boatId);
            var authResult = await _authService.AuthorizeAsync(HttpContext.User, boat, AuthorizationPolicies.EditBoatPolicy);
            Guard.Against.Forbidden(authResult);
            string inviterUserId = HttpContext.GetClaim(CustomClaimTypes.Id);
            User inviter = await _userRepo.GetByIdAsync(inviterUserId);
            Guard.Against.Null(inviter, nameof(inviter));
            IEnumerable<Invite> invites = await _boatService.AddCrewInvites(boatId, emails);
            foreach (var invite in invites)
            {
                await _emailClient.SendEmailAsync(new EmailMessage
                {
                    From = new Address(_emailConfig.From, _emailConfig.Name),
                    To = new List<Address> { new Address(invite.Email) },
                    Subject = "You've been invited to a Boat!",
                    Body = $"Captain {inviter.Name} has invited you to the boat {boat.Name}! {_apiConfig.BoatInviteBaseUrl}/boats/{boatId}/invites/inviteId={invite.Id} to accept."
                });
            }
            return Ok();
        }

        [HttpPost("{boatId}/invites/{inviteId}/accept")]
        public async Task<ActionResult<Boat>> AcceptInvite(string boatId, string inviteId)
        {
            Boat boat = await _boatService.AcceptBoatInvite(boatId, inviteId, HttpContext.GetClaim(ClaimTypes.Email));
            return Ok(boat);
            
        }

        [HttpPost("{boatId}/crew")]
        public Task<Boat> AddCrewMember(string boatId, [FromBody] CrewMember crewMember)
            => _boatService.AddCrewMember(boatId, crewMember);

        [HttpGet("{boatId}/crew")]
        public async Task<IEnumerable<CrewMemberWithUserInfo>> GetCrew(string boatId)
        {
            Boat boat = await _boatService.GetBoatById(boatId);
            IEnumerable<User> users = await _userRepo
                .GetAsync(u => boat.Crew.Any(cm => cm.UserId == u.Id));

            List<CrewMemberWithUserInfo> crew = new();
            foreach (var user in users)
            {
                CrewMember cm = boat.Crew.First(u => u.UserId == user.Id);
                crew.Add(new CrewMemberWithUserInfo
                {
                    UserId = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Role = cm.Role,
                    Info = cm.Info
                });
            }
            return crew;
        }

        [HttpDelete("{boatId}/crew/{userId}")]
        public async Task<IActionResult> DeleteCrewMember(string boatId, string userId)
        {
            await _boatService.DeleteCrewMember(boatId, userId);
            return Ok();
        }
    }
}