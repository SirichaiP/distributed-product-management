using AuthService.Domain.Entities;

namespace AuthService.Application.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken refreshToken);

        Task<RefreshToken?> GetByTokenAsync(string token);

        Task SaveChangesAsync();

        Task UpdateAsync(RefreshToken refreshToken);
    }
}