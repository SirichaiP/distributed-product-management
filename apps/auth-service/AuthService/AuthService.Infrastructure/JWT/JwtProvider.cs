using AuthService.Domain.Entities;
using AuthService.Infrastructure.JWT;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Application.Interfaces;

namespace AuthService.Infrastructure.JWT
{
    public sealed class JwtProvider : IJwtProvider
    {
        private readonly JwtSettings _settings;

        public JwtProvider(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),

            new Claim(ClaimTypes.Email,user.Email),

            new Claim(ClaimTypes.Role,user.Role)

            //new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            //new Claim(JwtRegisteredClaimNames.Email, user.Email),
            //new Claim(ClaimTypes.Role, user.Role)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public int ExpiresIn => _settings.ExpiryMinutes * 60;
    }
}