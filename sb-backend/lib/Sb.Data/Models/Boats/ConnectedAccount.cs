﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class ConnectedAccount
    {
        public Guid UserId { get; set; }
        public IdentityProviderEnum IdentityProviderId { get; set; }
        public IdentityProvider IdentityProvider { get; set; }
        public User User { get; set; }
    }

    internal class ConnectedAccountEntityTypeConfiguration
        : IEntityTypeConfiguration<ConnectedAccount>
    {
        public void Configure(EntityTypeBuilder<ConnectedAccount> builder)
        {
            builder.ToTable("ConnectedAccounts")
                .HasKey(ca => new { ca.UserId, ca.IdentityProviderId });

            builder.Property(ca => ca.IdentityProviderId)
                .HasConversion<int>();

            builder.HasOne(ca => ca.IdentityProvider)
                .WithMany()
                .HasForeignKey(ca => ca.IdentityProviderId)
                .IsRequired();
        }
    }
}