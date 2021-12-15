using HotChocolate.Data;

using MongoDB.Driver;

using Sb.Data;
using Sb.Data.Models.Mongo;
using Sb.Data.Mongo;

namespace Sb.Api
{
    public class Query
    {
        [UseFiltering]
        public IQueryable<User> GetUsers([Service] MongoRepository<User> userRepo)
        {
            return userRepo.Collection.AsQueryable();
        }

    }

    public class Mutation
    {
        public async Task<Boat> UpdateBoatAsync(
            [Service] IRepository<Boat> boatRepo,
            string boatId,
            string name,
            string description,
            Banner banner)
        {
            Boat b = await boatRepo.GetByIdAsync(boatId);
            b.Name = name ?? b.Name;
            b.Description = description ?? b.Description;
            b.Banner = banner ?? b.Banner;
            await boatRepo.UpdateAsync(b);
            return b;
        }
    }
}
