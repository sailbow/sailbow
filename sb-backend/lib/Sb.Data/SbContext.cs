using Microsoft.EntityFrameworkCore;

using Sb.Data.Models;

public class SailbowContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasBaseType<EntityBase>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .HasMany(u => u.UserCrewMembers)
            .WithOne(cm => cm.User)
            .HasForeignKey(cm => cm.UserId)
            .IsRequired();

        modelBuilder.Entity<Boat>()
            .HasBaseType<EntityBase>()
            .HasKey(b => b.Id);

        modelBuilder.Entity<Boat>()
            .HasMany(b => b.Crew)
            .WithOne(cm => cm.Boat)
            .HasForeignKey(cm => cm.BoatId)
            .IsRequired();

        modelBuilder.Entity<CrewMember>()
            .Property(cm => cm.Role)
            .IsRequired();
    }
}