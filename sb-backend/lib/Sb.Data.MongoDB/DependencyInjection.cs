using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;

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

            ConventionRegistry.Register(
               name: "camelCase",
               conventions: new ConventionPack { new CamelCaseElementNameConvention() },
               filter: t => true);

            ConventionRegistry.Register(
                name: "stringObjectIds",
                conventions: new ConventionPack { new StringObjectIdConvention() },
                filter: t => true);

            BsonClassMap.RegisterClassMap<ModuleOption>(md =>
            {
                md.AutoMap();
                md.UnmapField(md => md.Type);
                md.SetIsRootClass(true);
            });
            BsonClassMap.RegisterClassMap<DateModuleOptionData>();
            BsonClassMap.RegisterClassMap<LocationModuleOption>();

            services.AddTransient<IRepository, MongoRepository>();
            services.AddTransient<IIdGenerator, ObjectIdGenerator>();
            return services;
        }
    }
}