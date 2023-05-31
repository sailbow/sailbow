using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleOption : EntityBase
    {
        public Guid ModuleId { get; set; }
        public Guid AuthorId { get; set; }
        public ModuleType Type { get; set; }
        public ICollection<ModuleOptionVote> Votes { get; set; }
        public CrewMember Author { get; set; }
        public Module Module { get; set; }
        public ModuleOptionData ModuleOptionData { get; set; }
    }

    internal class ModuleOptionEntityTypeConfiguration
        : IEntityTypeConfiguration<ModuleOption>
    {
        public void Configure(EntityTypeBuilder<ModuleOption> builder)
        {
            builder.HasOne(mo => mo.Author)
                .WithMany()
                .HasForeignKey(mo => mo.AuthorId)
                .IsRequired();

            builder.HasMany(mo => mo.Votes)
                .WithOne()
                .HasForeignKey(v => v.ModuleOptionId)
                .IsRequired();
        }
    }
}
