using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class Boat : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Banner Banner { get; set; }
        public Code Code { get; set; }
        public Guid CaptainUserId { get; set; }
        public User Captain { get; set; }
        public ICollection<CrewMember> Crew { get; set; } = new List<CrewMember>();
        public ICollection<Module> Modules { get; set; } = new List<Module>();
    }

    internal class BoatEntityTypeConfiguration : IEntityTypeConfiguration<Boat>
    {
        public void Configure(EntityTypeBuilder<Boat> builder)
        {
            builder.ToTable("Boats");

            builder.HasOne(b => b.Captain)
                .WithMany()
                .HasForeignKey(b => b.CaptainUserId)
                .IsRequired();

            builder
                .OwnsOne(b => b.Code, c => c
                    .WithOwner(c => c.Boat)
                    .HasForeignKey(c => c.BoatId))

                .OwnsMany(b => b.Crew, cm => cm
                    .WithOwner(c => c.Boat)
                    .HasForeignKey(c => c.BoatId))

                .OwnsMany(b => b.Modules, m => m
                    .WithOwner(mo => mo.Boat)
                    .HasForeignKey(mo => mo.BoatId));

            builder.Property(b => b.Description)
                .IsRequired(false);

            builder.Property(b => b.Name)
                .HasMaxLength(25)
                .IsRequired();
        }
    }
}
