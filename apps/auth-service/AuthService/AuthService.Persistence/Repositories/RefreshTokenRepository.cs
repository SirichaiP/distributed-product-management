using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories
{
    public sealed class RefreshTokenRepository
        : IRefreshTokenRepository
    {
        private readonly AuthDbContext _context;

        public RefreshTokenRepository(AuthDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RefreshToken refreshToken)
        {
            await _context.RefreshTokens.AddAsync(refreshToken);
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens.Include(x => x.User).FirstOrDefaultAsync(x => x.Token == token);
        }

        public Task UpdateAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);

            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}