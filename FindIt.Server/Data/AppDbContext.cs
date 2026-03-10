using Microsoft.EntityFrameworkCore;
using FindIt.Server.Models;

namespace FindIt.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Item> Items { get; set; }

    public DbSet<Claim> Claims { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Claim>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Claim>()
            .HasOne(c => c.Item)
            .WithMany()
            .HasForeignKey(c => c.ItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}