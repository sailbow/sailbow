using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public abstract class EntityBase
    {
        public Guid Id { get; set; }
    }

    internal class EntityBaseEntityTypeConfiguration
        : IEntityTypeConfiguration<EntityBase>
    {
        public void Configure(EntityTypeBuilder<EntityBase> builder)
        {
            builder.HasKey(eb => eb.Id);
            builder.Property(eb => eb.Id)
                .ValueGeneratedOnAdd();

            builder.UseTpcMappingStrategy();
        }
    }
}
