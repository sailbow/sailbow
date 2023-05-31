using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public abstract class ModuleOptionData : EntityBase
    {
        public Guid ModuleOptionId { get; set; }
        public ModuleOption ModuleOption { get; set; }
    }

    internal class ModuleOptionDataEntityTypeConfiguration
        : IEntityTypeConfiguration<ModuleOptionData>
    {
        public void Configure(EntityTypeBuilder<ModuleOptionData> builder)
        {
            builder.UseTpcMappingStrategy()
                .HasOne(d => d.ModuleOption)
                .WithOne(mo => mo.ModuleOptionData)
                .HasForeignKey<ModuleOptionData>(mo => mo.ModuleOptionId)
                .IsRequired();
        }
    }
}
