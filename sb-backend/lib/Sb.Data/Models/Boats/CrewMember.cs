using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Sb.Data.Models
{
    public class CrewMember : EntityBase
    {
        public Guid BoatId { get; set; }
        public Guid UserId { get; set; }
        public BoatRole Role { get; set; }
        public string Info { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        [JsonIgnore]
        public Boat Boat { get; set; }

        [JsonIgnore]
        public ICollection<ModuleOptionVote> Votes { get; set; }
    }

    internal class CrewMemberEntityTypeConfiguration
        : IEntityTypeConfiguration<CrewMember>
    {
        public void Configure(EntityTypeBuilder<CrewMember> builder)
        {
            builder.Property(cm => cm.Role)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(cm => cm.User)
                .WithMany(u => u.CrewMemberships)
                .HasForeignKey(cm => cm.UserId)
                .IsRequired();

            builder.Property(cm => cm.Info)
                .HasMaxLength(100)
                .IsRequired(false);
        }
    }
}
