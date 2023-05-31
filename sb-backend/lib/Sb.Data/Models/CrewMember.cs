using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    public class CrewMember : EntityBase
    {
        public Guid BoatId { get; set; }
        public Guid UserId { get; set; }
        public Role Role { get; set; }
        public string Info { get; set; }
        public User User { get; set; }
        public Boat Boat { get; set; }
        public string Email => User.Email;
    }

    internal class CrewMemberEntityTypeConfiguration
        : IEntityTypeConfiguration<CrewMember>
    {
        public void Configure(EntityTypeBuilder<CrewMember> builder)
        {
            builder.ToTable("CrewMembers")
                .Property(cm => cm.Role)
                .HasConversion<string>();

            builder.HasOne(cm => cm.User)
                .WithMany()
                .HasForeignKey(cm => cm.UserId)
                .IsRequired();

            builder.Property(cm => cm.Info)
                .HasMaxLength(100)
                .IsRequired(false);

            builder.Ignore(cm => cm.Email);
        }
    }
}
