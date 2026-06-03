using AuthService.Domain.Entities;

namespace AuthService.Application.Interfaces
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);

         int ExpiresIn { get; }
    }
}
