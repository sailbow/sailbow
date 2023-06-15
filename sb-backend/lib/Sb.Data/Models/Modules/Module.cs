using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Sb.Data.Models
{
    public class Module : EntityBase
    {
        public Guid BoatId { get; set; }
        public Guid CreatedByCrewMemberId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public Guid? FinalizedOptionId { get; set; }
        public ModuleSettings Settings { get; set; }
        public Boat Boat { get; set; }

        [JsonIgnore]
        public ModuleOption FinalizedOption { get; set; }

        [JsonIgnore]
        public CrewMember CreatedByCrewMember { get; set; }

        [JsonIgnore]
        public ICollection<ModuleOption> ModuleOptions { get; set; } = new List<ModuleOption>();
    }

    internal class ModuleEntityTypeConfiguration
        : IEntityTypeConfiguration<Module>
    {
        public void Configure(EntityTypeBuilder<Module> builder)
        {
            builder.HasOne(m => m.CreatedByCrewMember)
                .WithMany()
                .HasForeignKey(m => m.CreatedByCrewMemberId)
                .IsRequired();

            builder.Property(m => m.Name)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(m => m.Description)
                .HasMaxLength(250)
                .IsRequired(false);

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

    public enum ModuleType
    {
        Date,
        Location
    }
}
