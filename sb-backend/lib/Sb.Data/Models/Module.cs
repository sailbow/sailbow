using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class Module : EntityBase
    {
        public Guid BoatId { get; set; }
        public Guid CreatedByCrewMemberId { get; set; }
        public string Name { get; set; }
        public ModuleType Type { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public Guid? FinalizedOptionId { get; set; }
        public ModuleSettings Settings { get; set; }
        public Boat Boat { get; set; }
        public ModuleOption FinalizedOption { get; set; }
        public CrewMember CreatedByCrewMember { get; set; }
        public ICollection<ModuleOption> ModuleOptions { get; set; } = new List<ModuleOption>();
    }

    internal class ModuleEntityTypeConfiguration
        : IEntityTypeConfiguration<Module>
    {
        public void Configure(EntityTypeBuilder<Module> builder)
        {
            builder.ToTable("Modules")
                .HasOne(m => m.CreatedByCrewMember)
                .WithMany()
                .HasForeignKey(m => m.CreatedByCrewMemberId)
                .IsRequired();

            builder.Property(m => m.Name)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(m => m.Description)
                .HasMaxLength(250)
                .IsRequired(false);

            builder
                .OwnsMany(m => m.ModuleOptions, mo => mo
                    .WithOwner(o => o.Module)
                    .HasForeignKey(o => o.ModuleId));

            builder.HasOne(m => m.FinalizedOption)
                .WithOne()
                .IsRequired(false);

            builder.HasOne(m => m.Settings)
                .WithOne(ms => ms.Module)
                .HasForeignKey<ModuleSettings>(ms => ms.ModuleId)
                .IsRequired();

            builder.Property(m => m.Type)
                .HasConversion<string>()
                .IsRequired();
        }
    }

    public enum ModuleType
    {
        Date,
        Location
    }
}
