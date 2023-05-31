using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class DateModuleOptionData : ModuleOptionData
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    internal class DateModuleOptionEntityTypeConfiguration
        : IEntityTypeConfiguration<DateModuleOptionData>
    {
        public void Configure(EntityTypeBuilder<DateModuleOptionData> builder)
        {
            builder.ToTable("DateModuleOptionData");

            builder.Property(o => o.StartDate)
                .IsRequired();

            builder.Property(o => o.EndDate)
                .IsRequired(false);
        }
    }
}
