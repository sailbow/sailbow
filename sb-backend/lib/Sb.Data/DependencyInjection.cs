
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

            public void AddMongo(Action<MongoConfiguration> configure)
            {
                MongoConfiguration config = new();
                configure(config);

                _services.AddOptions();
                _services.ConfigureOptions(config);
                _services.AddTransient(typeof(IMongoRepository<>), typeof(MongoRepository<>));
            }
        }
    }
}
