﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class CrewMember : EntityBase
    {
        public Guid BoatId { get; set; }
        public Guid UserId { get; set; }
        public BoatRole Role { get; set; }
        public string? Info { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public Boat? Boat { get; set; }

        [JsonIgnore]
        public ICollection<ModuleOptionVote> Votes { get; set; } = new List<ModuleOptionVote>();
    }

    internal class CrewMemberEntityTypeConfiguration
        : IEntityTypeConfiguration<CrewMember>
    {
        public void Configure(EntityTypeBuilder<CrewMember> builder)
        {
            builder.Property(cm => cm.Role)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(cm => cm.Boat)
                .WithMany(b => b.Crew)
                .HasForeignKey(cm => cm.BoatId)
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
