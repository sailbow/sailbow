using HotChocolate.Data;

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
        public IExecutable<User> GetUsers([Service] MongoRepository<User> userRepo)
        {
            return userRepo.Collection.AsExecutable();
        }
    }
}
