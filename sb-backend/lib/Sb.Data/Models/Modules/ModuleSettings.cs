using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleSettings
    {
        public Guid ModuleId { get; set; }
        public bool AllowMultiple { get; set; }
        public bool AnonymousVoting { get; set; }
        public DateTime? Deadline { get; set; }

        [JsonIgnore]
        public Module Module { get; set; }
    }

    internal class ModuleSettingsEntityTypeConfiguration
        : IEntityTypeConfiguration<ModuleSettings>
    {
        public void Configure(EntityTypeBuilder<ModuleSettings> builder)
        {
            builder.ToTable(nameof(ModuleSettings))
                .HasKey(s => s.ModuleId);

            builder.Property(s => s.AllowMultiple)
                .HasDefaultValue(false)
                .IsRequired();

            builder.Property(s => s.AnonymousVoting)
                .HasDefaultValue(false)
                .IsRequired();
        }
    }
}
