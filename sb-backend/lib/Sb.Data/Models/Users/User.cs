using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class User : EntityBase
    {
        public string Name { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public IdentityProvider? IdentityProvider { get; set; }
        public string? IdentityProviderId { get; set; }

        [JsonIgnore]
        public string? Hash { get; set; }

        [JsonIgnore]
        public ICollection<Boat> OwnedBoats { get; set; } = new List<Boat>();

        [JsonIgnore]
        public ICollection<CrewMember> CrewMemberships { get; set; } = new List<CrewMember>();
    }

    internal class UserEntityTypeConfiguration
        : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(u => u.Name)
                .HasAnnotation("AllowEmptyStrings", false)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(u => u.Email)
                .IsRequired(true);

            builder.Property(u => u.IdentityProvider)
                .HasConversion<string>()
                .HasMaxLength(25)
                .IsRequired(false);

            builder.HasMany(u => u.CrewMemberships)
                .WithOne(cm => cm.User)
                .HasForeignKey(cm => cm.UserId)
                .IsRequired();
        }
    }
}
