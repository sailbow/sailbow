using HotChocolate.Data;

using MongoDB.Driver;

using Sb.Data.Models.Mongo;
using Sb.Data.Mongo;

namespace Sb.Api
{
    public class Query
    {
        [UsePaging]
        [UseProjection]
        [UseSorting]
        [UseFiltering]
        public IQueryable<User> GetUsers([Service] MongoRepository<User> userRepo)
        {
            return userRepo.Collection.AsQueryable();
        }
    }
}
