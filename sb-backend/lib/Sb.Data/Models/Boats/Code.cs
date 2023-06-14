using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class Code
    {
        public Guid BoatId { get; set; }
        public string Value { get; set; }
        public DateTime ExpiresAt { get; set; }
        public Boat Boat { get; set; }
    }

    internal class CodeEntityTypeConfiguration
        : IEntityTypeConfiguration<Code>
    {
        public void Configure(EntityTypeBuilder<Code> builder)
        {
            builder.ToTable("BoatCodes");
            builder.HasIndex(c => c.Value)
                .IsUnique();
        }
    }
}
