using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleOptionVote
    {
        public Guid CrewMemberId { get; set; }
        public Guid ModuleOptionId { get; set; }
        public CrewMember CrewMember { get; set; }
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
                .WithMany()
                .HasForeignKey(v => v.CrewMemberId)
                .IsRequired();
        }
    }
}
