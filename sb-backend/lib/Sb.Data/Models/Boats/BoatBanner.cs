using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models;

public enum BannerType
{
    Color,
    Link
}
public class BoatBanner
{
    public Guid BoatId { get; set; }
    public bool Show { get; set; } = false;
    public BannerType Type { get; set; }
    public string Value { get; set; } = string.Empty;
    public int? Position { get; set; }

    [JsonIgnore]
    public Boat? Boat { get; set; }
}

internal class BoatBannerEntityTypeConfiguration : IEntityTypeConfiguration<BoatBanner>
{
    public void Configure(EntityTypeBuilder<BoatBanner> builder)
    {
        builder.ToTable("BoatBanners")
            .HasKey(b => b.BoatId);

        builder.Property(b => b.Type)
            .HasConversion<string>()
            .IsRequired();
        
        builder.Property(b => b.Value)
            .IsRequired();
    }
}