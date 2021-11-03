
using Sb.Data;
using Sb.Data.Models.Mongo;
using Sb.Data.Mongo;

using System;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static SbDatabases AddSbDatabase(this IServiceCollection services)
        {
            return new SbDatabases(services);
        }

        public class SbDatabases
        {
            private readonly IServiceCollection _services;
            internal SbDatabases(IServiceCollection services)
            {
                _services = services;
            }

            public void AddMongo(Action<MongoConfiguration> configureAction)
            {
                MongoConfiguration config = new();
                configureAction(config);
                _services.AddSingleton(config);
                _services.AddSingleton(typeof(IRepository<>), typeof(MongoRepository<>));
            }
        }
    }
}
