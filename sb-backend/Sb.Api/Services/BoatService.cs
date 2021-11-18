using Ardalis.GuardClauses;

using Sb.Data;
using Sb.Data.Models.Mongo;

namespace Sb.Api.Services
{
    public class BoatService
    {
        private readonly IRepository<Boat> _boatRepo;
        private readonly IRepository<User> _userRepo;

        public BoatService(IRepository<Boat> boatRepo, IRepository<User> userRepo)
        {
            _boatRepo = boatRepo;
            _userRepo = userRepo;
        }

        public async Task<Boat> CreateBoat(Boat boat)
        {
            Guard.Against.Null(boat, nameof(boat));
            Boat inserted = await _boatRepo.InsertAsync(boat);
            return inserted;
        }

        public async Task<Boat> GetBoatById(string boatId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            return await _boatRepo.GetByIdAsync(boatId);
        }

        public async Task<Boat> AddCrewMember(string boatId, CrewMember crewMember)
        {
            Guard.Against.Null(crewMember, nameof(crewMember));
            Guard.Against.NullOrWhiteSpace(crewMember.UserId, nameof(crewMember.UserId));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            Guard.Against.EntityMissing(boat, nameof(boat));

            if (!boat.Crew.Any(member => member.UserId == crewMember.UserId))
            {
                User user = await _userRepo.GetByIdAsync(crewMember.UserId);
                Guard.Against.EntityMissing(user, nameof(user));
                boat.Crew = boat.Crew.Append(crewMember);
                await _boatRepo.UpdateAsync(boat);
            }
            return boat;
        }

        public async Task DeleteCrewMember(string boatId, string userId)
        {
            Guard.Against.NullOrWhiteSpace(boatId, nameof(boatId));
            Guard.Against.NullOrWhiteSpace(userId, nameof(userId));

            Boat boat = await _boatRepo.GetByIdAsync(boatId);
            if (boat != null)
            {
                boat.Crew = boat.Crew.Where(cm => cm.UserId != userId);
                await _boatRepo.UpdateAsync(boat);
            }
        }
    }
}
