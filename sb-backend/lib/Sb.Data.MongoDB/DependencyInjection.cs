using MongoDB.Bson.Serialization;

using Sb.Data;
using Sb.Data.Models;
using Sb.Data.MongoDB;

using IIdGenerator = Sb.Data.IIdGenerator;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddMongoDB(this IServiceCollection services, Action<MongoConfiguration> configureAction)
        {
            MongoConfiguration config = new();
            configureAction(config);
            services.AddSingleton(config);
            services.AddTransient<IRepository, MongoRepository>();
            services.AddTransient<IIdGenerator, ObjectIdGenerator>();
            return services;
        }
    }
}