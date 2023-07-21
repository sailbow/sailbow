using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class Boat : EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CaptainUserId { get; set; }
        public User? Captain { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public BoatBanner? Banner { get; set; }
        public ICollection<CrewMember> Crew { get; set; } = new List<CrewMember>();

        public ICollection<Module> Modules { get; set; } = new List<Module>();

        [JsonIgnore]
        public ICollection<Invite> Invites { get; set; } = new List<Invite>();
    }

    internal class BoatEntityTypeConfiguration : IEntityTypeConfiguration<Boat>
    {
        public void Configure(EntityTypeBuilder<Boat> builder)
        {
            builder.ToTable("Boats");

            builder.HasOne(b => b.Captain)
                .WithMany(u => u.OwnedBoats)
                .HasForeignKey(b => b.CaptainUserId)
                .IsRequired();

            builder.HasMany(b => b.Invites)
                .WithOne(i => i.Boat)
                .HasForeignKey(i => i.BoatId)
                .IsRequired();

            builder.HasMany(b => b.Modules)
                .WithOne(m => m.Boat)
                .HasForeignKey(m => m.BoatId)
                .IsRequired();

            builder.HasOne(b => b.Banner)
                .WithOne(b => b.Boat)
                .HasForeignKey<BoatBanner>(b => b.BoatId)
                .IsRequired();

            builder.Property(b => b.Description)
                .HasMaxLength(256)
                .IsRequired(false);

            builder.Property(b => b.Name)
                .HasMaxLength(25)
                .IsRequired();

            builder.Property(b => b.DateCreated)
                .IsRequired();
        }
    }
}
