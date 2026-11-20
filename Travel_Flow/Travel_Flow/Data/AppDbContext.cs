using Microsoft.EntityFrameworkCore;
using Travel_Flow.Models;

namespace Travel_Flow.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>()
            .Property(b => b.Adr)
            .HasPrecision(10, 2);
    }
}
