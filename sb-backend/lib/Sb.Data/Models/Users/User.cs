using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class User : EntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public string Hash { get; set; }

        [JsonIgnore]
        public ICollection<Boat> OwnedBoats { get; set; }

        [JsonIgnore]
        public ICollection<ConnectedAccount> ConnectedAccounts { get; set; }

        [JsonIgnore]
        public ICollection<CrewMember> CrewMemberships { get; set; }
    }

    internal class UserEntityTypeConfiguration
        : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(u => u.Name)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(u => u.Email)
                .IsRequired(true);

            builder.Property(u => u.Hash)
                .IsRequired(false);

            builder.HasMany(u => u.CrewMemberships)
                .WithOne(cm => cm.User)
                .HasForeignKey(cm => cm.UserId)
                .IsRequired();

            builder.HasMany(u => u.ConnectedAccounts)
                .WithOne(ca => ca.User)
                .HasForeignKey(ca => ca.UserId)
                .IsRequired();
        }
    }
}
