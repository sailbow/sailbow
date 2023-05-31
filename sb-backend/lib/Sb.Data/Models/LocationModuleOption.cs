using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class LocationModuleOption : ModuleOptionData
    {
    }

    internal class LocationModuleOptionEntityTypeConfiguration
        : IEntityTypeConfiguration<LocationModuleOption>
    {
        public void Configure(EntityTypeBuilder<LocationModuleOption> builder)
        {
            builder.ToTable("LocationModuleOptionData");
        }
    }
}
