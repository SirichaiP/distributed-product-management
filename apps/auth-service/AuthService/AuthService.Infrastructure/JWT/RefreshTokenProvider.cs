using AuthService.Application.Interfaces;
using System.Security.Cryptography;

namespace AuthService.Infrastructure.JWT
{
    public sealed class RefreshTokenProvider
        : IRefreshTokenProvider
    {
        public string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);

            return Convert.ToBase64String(bytes);
        }
    }
}