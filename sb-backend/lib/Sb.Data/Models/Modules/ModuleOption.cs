using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleOption : EntityBase
    {
        public Guid ModuleId { get; set; }
        public Guid AuthorId { get; set; }
        public ICollection<ModuleOptionVote> Votes { get; set; }
        public CrewMember Author { get; set; }
        public Module Module { get; set; }
        public ModuleOptionData Data { get; set; }
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

            var serializerOptions = new JsonSerializerOptions(new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            builder.Property(mo => mo.Data)
                .HasConversion(
                    mo => JsonSerializer.Serialize(mo, serializerOptions),
                    str => JsonSerializer.Deserialize<ModuleOptionData>(str, serializerOptions))
                .IsRequired();

            builder.OwnsMany(mo => mo.Votes)
                .WithOwner(v => v.ModuleOption)
                .HasForeignKey(v => v.ModuleOptionId);
        }
    }
}
