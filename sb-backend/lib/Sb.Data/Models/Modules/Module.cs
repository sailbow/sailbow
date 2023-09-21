using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class Module : EntityBase
    {
        public Guid BoatId { get; set; }
        public Guid CreatedByCrewMemberId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Order { get; set; }
        public Guid? FinalizedOptionId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public ModuleType Type { get; set; }
        public ModuleSettings? Settings { get; set; }

        [JsonIgnore]
        public Boat? Boat { get; set; }

        [JsonIgnore]
        public CrewMember? CreatedBy { get; set; }

        [JsonIgnore]
        public ICollection<ModuleOption> ModuleOptions { get; set; } = new List<ModuleOption>();
    }

    internal class ModuleEntityTypeConfiguration
        : IEntityTypeConfiguration<Module>
    {
        public void Configure(EntityTypeBuilder<Module> builder)
        {
            builder.HasOne(m => m.CreatedBy)
                .WithMany()
                .HasForeignKey(m => m.CreatedByCrewMemberId)
                .IsRequired();

            builder.Property(m => m.Name)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(m => m.Description)
                .HasMaxLength(250)
                .IsRequired(false);

            builder.Property(m => m.Type)
                .HasConversion<string>()
                .HasMaxLength(25)
                .IsRequired();

            builder.HasMany(m => m.ModuleOptions)
                .WithOne(mo => mo.Module)
                .HasForeignKey(mo => mo.ModuleId)
                .IsRequired();

            builder.HasOne(m => m.Settings)
                .WithOne(s => s.Module)
                .HasForeignKey<ModuleSettings>(s => s.ModuleId)
                .IsRequired();
        }
    }
}
