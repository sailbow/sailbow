using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Sb.Data.Models
{
    public class Invite : EntityBase
    {
        public Guid InviterId { get; set; }
        public Guid BoatId { get; set; }
        public string Email { get; set; }
        public BoatRole BoatRole { get; set; }
        public DateTime ExpiresUtc { get; set; }

        [JsonIgnore]
        public User Inviter { get; set; }

        [JsonIgnore]
        public Boat Boat { get; set; }
    }

    internal class InviteEntityTypeConfiguration
    : IEntityTypeConfiguration<Invite>
    {
        public void Configure(EntityTypeBuilder<Invite> builder)
        {
            builder.HasOne(i => i.Inviter)
                .WithMany()
                .HasForeignKey(i => i.InviterId)
                .IsRequired();

            builder.Property(i => i.Email)
                .IsRequired();

            builder.Property(i => i.BoatRole)
                .HasConversion<string>()
                .HasDefaultValue(BoatRole.Sailor)
                .IsRequired();

            builder.Property(i => i.ExpiresUtc)
                .IsRequired();
        }
    }
}
