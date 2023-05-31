using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Sb.Data.Models
{
    public class User : EntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public string Hash { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public ICollection<ConnectedAccount> ConnectedAccounts { get; set; }
        public ICollection<CrewMember> CrewMemberships { get; set; }
    }

    internal class UserEntityTypeConfiguration
        : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users")
                .Property(u => u.Name)
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

            builder.OwnsMany(c => c.ConnectedAccounts, ca => ca
                .WithOwner(ca => ca.User)
                .HasForeignKey(ca => ca.UserId));
        }
    }
}
