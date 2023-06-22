using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ModuleOption : EntityBase
    {
        public Guid ModuleId { get; set; }
        public Guid CreatedByCrewMemberId { get; set; }
        public ICollection<ModuleOptionVote> Votes { get; set; } = new List<ModuleOptionVote>();
        public ModuleOptionData Data { get; set; }

        [JsonIgnore]
        public CrewMember CreatedByCrewMember { get; set; }

        [JsonIgnore]
        public Module Module { get; set; }
    }

    internal class ModuleOptionEntityTypeConfiguration
        : IEntityTypeConfiguration<ModuleOption>
    {
        public void Configure(EntityTypeBuilder<ModuleOption> builder)
        {
            builder.HasOne(mo => mo.CreatedByCrewMember)
                .WithMany()
                .HasForeignKey(mo => mo.CreatedByCrewMemberId)
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

            builder.HasMany(mo => mo.Votes)
                .WithOne(v => v.ModuleOption)
                .HasForeignKey(v => v.ModuleOptionId)
                .IsRequired();
        }
    }
}
