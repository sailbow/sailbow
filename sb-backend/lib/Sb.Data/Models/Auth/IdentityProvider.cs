using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class IdentityProvider
    {
        public IdentityProviderEnum Id { get; set; }
        public string Name { get; set; }
    }

    public enum IdentityProviderEnum
    {
        Google = 1,
        Facebook = 2
    }

    public class IdentityProviderEntityTypeConfiguration
        : IEntityTypeConfiguration<IdentityProvider>
    {
        public void Configure(EntityTypeBuilder<IdentityProvider> builder)
        {
            builder.ToTable("IdentityProviders")
                .HasKey(ip => ip.Id);

            builder.Property(ip => ip.Id)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(ip => ip.Name)
                .IsRequired();

            builder.HasData(Enum.GetValues<IdentityProviderEnum>()
                .Select(ip => new IdentityProvider { Id = ip, Name = Enum.GetName(ip) }));
        }
    }
}
