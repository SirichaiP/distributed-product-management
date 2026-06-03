using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.DbContexts;

public class AuthDbContext : DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Token)
                .IsRequired()
                .HasMaxLength(500);

            entity.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId);
        });

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Token)
                .IsRequired()
                .HasMaxLength(500);

            entity.HasIndex(x => x.Token)
                .IsUnique();

            entity.Property(x => x.ExpiresAt)
                .IsRequired();

            entity.Property(x => x.IsUsed)
                .IsRequired();

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}