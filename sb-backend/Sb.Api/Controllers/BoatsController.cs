﻿using Ardalis.GuardClauses;

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
        private readonly EmailService _emailService;
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Invite> _inviteRepo;
        private readonly IAuthorizationService _authService;

        private readonly EmailConfig _emailConfig;
        private readonly SbApiConfig _apiConfig;

        public BoatsController(
            BoatService boatService,
            EmailService emailService,
            IRepository<User> userRepo,
            IRepository<Invite> inviteRepo,
            IAuthorizationService authService)
        {
            _boatService = boatService;
            _emailService = emailService;
            _userRepo = userRepo;
            _inviteRepo = inviteRepo;
            _authService = authService;
        }

        [HttpPost("create")]
        public async Task<Boat> CreateBoat([FromBody] Boat boat)
        {
            string id = HttpContext.GetClaim(CustomClaimTypes.Id);
            Guard.Against.NullOrWhiteSpace(id, nameof(id));

            var invitees = boat.Crew.Where(cm => cm.Email != HttpContext.GetClaim(ClaimTypes.Email));

            boat.Crew = new List<CrewMember>
            {
                new CrewMember
                {
                    UserId = id,
                    Role = Role.Captain,
                    Info = string.Empty
                }
            };

            boat = await _boatService.CreateBoat(boat);

            var invites = invitees.Select(invitee => new Invite
            {
                BoatId = boat.Id,
                Email = invitee.Email,
                Role = invitee.Role
            });
            await SendBoatInvites(boat.Id, invites);
            return boat;
        }

        [HttpGet("{boatId}")]
        public Task<Boat> GetBoatById(string boatId)
            => _boatService.GetBoatById(boatId);

        [HttpPost("{boatId}/invites")]
        public async Task<IActionResult> SendBoatInvites(string boatId, [FromBody] IEnumerable<Invite> invites)
        {
            await _emailService.SendBoatInvitations(boatId, invites);
            return Ok();
        }

        [HttpPost("{boatId}/invites/{inviteId}/accept")]
        public async Task<ActionResult<Boat>> AcceptInvite(string boatId, string inviteId)
        {
            await _boatService.AcceptBoatInvite(boatId, inviteId, HttpContext.GetClaim(ClaimTypes.Email));
            Boat boat = await _boatService.GetBoatById(boatId);
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