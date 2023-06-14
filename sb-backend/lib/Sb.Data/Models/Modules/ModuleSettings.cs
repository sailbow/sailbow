using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleSettings : EntityBase
    {
        public bool AllowMultiple { get; set; }
        public bool AnonymousVoting { get; set; }
        public DateTime? Deadline { get; set; }
        public Guid ModuleId { get; set; }
        public Module Module { get; set; }
    }

    internal class ModuleSettingsEntityTypeConfiguration
        : IEntityTypeConfiguration<ModuleSettings>
    {
        public void Configure(EntityTypeBuilder<ModuleSettings> builder)
        {
            builder.Property(s => s.AllowMultiple)
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(s => s.AnonymousVoting)
                .HasDefaultValue(false)
                .IsRequired();
        }
    }
}
