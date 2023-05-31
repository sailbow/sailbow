using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class Banner : EntityBase
    {
        public Guid BoatId { get; set; }
        public bool Show { get; set; }
        public BannerType Type { get; set; }
        public string Value { get; set; }
        public int Position { get; set; }
        public Boat Boat { get; set; }
    }

    internal class BannerEntityTypeConfiguration
        : IEntityTypeConfiguration<Banner>
    {
        public void Configure(EntityTypeBuilder<Banner> builder)
        {
            builder.ToTable("BoatBanners")
                .Property(b => b.Show)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(b => b.Position)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(b => b.Type)
                .HasConversion<string>()
                .HasDefaultValue(BannerType.Color)
                .IsRequired();
        }
    }
}
