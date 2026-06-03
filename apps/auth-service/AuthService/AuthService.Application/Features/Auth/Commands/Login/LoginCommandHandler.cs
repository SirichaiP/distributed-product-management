using AuthService.Application.Common.Exceptions;
using AuthService.Application.Features.Auth.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands.Login
{
    public sealed class LoginCommandHandler
     : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly IJwtProvider _jwt;
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IRefreshTokenProvider _refreshTokenProvider;
        private readonly IRefreshTokenRepository _refreshTokens;

        public LoginCommandHandler(IJwtProvider jwt, IUserRepository users, IPasswordHasher passwordHasher
                        ,IRefreshTokenProvider refreshTokenProvider, IRefreshTokenRepository refreshTokens)
        {
            _jwt = jwt;
            _users = users;
            _passwordHasher = passwordHasher;
            _refreshTokenProvider = refreshTokenProvider;
            _refreshTokens = refreshTokens;

        }

        public async Task<AuthResponse> Handle(LoginCommand request,CancellationToken cancellationToken)
        {
            var user = await _users.GetByEmailAsync(request.Email,cancellationToken);

            if (user is null)
                throw new UnauthorizedException(
                    "Invalid email or password.");

            var valid = _passwordHasher.Verify(request.Password,user.PasswordHash);

            if (!valid)
                throw new UnauthorizedException(
                    "Invalid email or password.");

            if (!user.IsActive)
                throw new UnauthorizedException(
                    "User is inactive.");

            var accessToken = _jwt.GenerateToken(user);

            var refreshTokenValue = _refreshTokenProvider.GenerateRefreshToken();

            var refreshTokenExpiry = request.RememberMe
                ? DateTime.UtcNow.AddDays(30)
                : DateTime.UtcNow.AddDays(7);

            var refreshToken = new RefreshToken(user.Id,refreshTokenValue,refreshTokenExpiry);

            await _refreshTokens.AddAsync(refreshToken);

            await _refreshTokens.SaveChangesAsync();

            return new AuthResponse(
                accessToken,
                refreshTokenValue,
                _jwt.ExpiresIn);
        }

    }


}
