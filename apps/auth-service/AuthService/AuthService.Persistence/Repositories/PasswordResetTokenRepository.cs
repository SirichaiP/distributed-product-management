using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;

using AuthService.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public sealed class PasswordResetTokenRepository
    : IPasswordResetTokenRepository
{
    private readonly AuthDbContext _context;

    public PasswordResetTokenRepository(AuthDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(PasswordResetToken token)
    {
        await _context.PasswordResetTokens.AddAsync(token);
        await _context.SaveChangesAsync();
    }

    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        return await _context.PasswordResetTokens
            .FirstOrDefaultAsync(x => x.Token == token);
    }

    public async Task UpdateAsync(PasswordResetToken token)
    {
        _context.PasswordResetTokens.Update(token);
        await _context.SaveChangesAsync();
    }
}