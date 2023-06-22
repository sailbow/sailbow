using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleOptionVote
    {
        public Guid CrewMemberId { get; set; }
        public Guid ModuleOptionId { get; set; }

        [JsonIgnore]
        public CrewMember CrewMember { get; set; }

        [JsonIgnore]
        public ModuleOption ModuleOption { get; set; }
    }

    internal class ModuleVoteEntityTypeConfiguration
        : IEntityTypeConfiguration<ModuleOptionVote>
    {
        public void Configure(EntityTypeBuilder<ModuleOptionVote> builder)
        {
            builder.ToTable("ModuleOptionVotes")
                .HasKey(v => new { v.CrewMemberId, v.ModuleOptionId });

            builder.HasOne(v => v.CrewMember)
                .WithMany(cm => cm.Votes)
                .HasForeignKey(v => v.CrewMemberId)
                .IsRequired();
        }
    }
}
