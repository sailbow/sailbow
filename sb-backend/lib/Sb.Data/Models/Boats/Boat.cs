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
        public string BannerColor { get; set; }
        public Uri BannerUrl { get; set; }
        //public Code Code { get; set; }
        public Guid CaptainUserId { get; set; }
        public User Captain { get; set; }

        public ICollection<CrewMember> Crew { get; set; } = new List<CrewMember>();
        public ICollection<Module> Modules { get; set; } = new List<Module>();
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

            builder.HasMany(b => b.Crew)
                .WithOne(cm => cm.Boat)
                .HasForeignKey(cm => cm.BoatId)
                .IsRequired();

            builder.HasMany(b => b.Invites)
                .WithOne(i => i.Boat)
                .HasForeignKey(i => i.BoatId)
                .IsRequired();

            builder.HasMany(b => b.Modules)
                .WithOne(m => m.Boat)
                .HasForeignKey(m => m.BoatId)
                .IsRequired();

            builder.Property(b => b.Description)
                .HasMaxLength(256)
                .IsRequired(false);

            builder.Property(b => b.Name)
                .HasMaxLength(25)
                .IsRequired();

            builder.Property(b => b.BannerUrl)
                .HasConversion(
                    url => url.ToString(),
                    str => new Uri(str))
                .IsRequired(false);

            builder.Property(b => b.BannerColor)
                .HasMaxLength(6)
                .IsRequired(false);
        }
    }
}
