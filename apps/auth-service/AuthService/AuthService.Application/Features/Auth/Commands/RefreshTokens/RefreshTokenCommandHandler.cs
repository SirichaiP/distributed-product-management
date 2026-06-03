using AuthService.Application.Common.Exceptions;
using AuthService.Application.Features.Auth.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using MediatR;


namespace AuthService.Application.Features.Auth.Commands.RefreshTokens;

public sealed class RefreshTokenCommandHandler
    : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IRefreshTokenRepository _refreshTokens;
    private readonly IUserRepository _users;
    private readonly IJwtProvider _jwtProvider;
    private readonly IRefreshTokenProvider _refreshTokenProvider;

    public RefreshTokenCommandHandler(IRefreshTokenRepository refreshTokens,IUserRepository users,
        IJwtProvider jwtProvider,IRefreshTokenProvider refreshTokenProvider)
    {
        _refreshTokens = refreshTokens;
        _users = users;
        _jwtProvider = jwtProvider;
        _refreshTokenProvider = refreshTokenProvider;
    }

    public async Task<AuthResponse> Handle(RefreshTokenCommand request,CancellationToken cancellationToken)
    {
        // 1. หา refresh token เดิม
        var existingRefreshToken =await _refreshTokens.GetByTokenAsync(request.RefreshToken);

        if (existingRefreshToken is null)
        {
            throw new UnauthorizedAccessException("Invalid refresh token.");
        }

       
        if (existingRefreshToken.IsRevoked)
        {
            throw new UnauthorizedAccessException("Refresh token has been revoked.");
        }

       
        if (existingRefreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token has expired.");
        }

        
        var user =await _users.GetByIdAsync(existingRefreshToken.UserId);

        if (user is null)
        {
            throw new NotFoundException("User");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User is inactive.");
        }

        
        var accessToken =_jwtProvider.GenerateToken(user);

      
        existingRefreshToken.Revoke();

        
        var refreshTokenValue = _refreshTokenProvider.GenerateRefreshToken();

        // กำหนดให้ refresh token หมดอายุใน 2 นาทีเพื่อทดสอบการหมดอายุของ refresh token ได้ง่ายขึ้น
        var expiresAt = DateTime.UtcNow.AddMinutes(2);

        
        var newRefreshToken = new RefreshToken(user.Id, refreshTokenValue, expiresAt);

        await _refreshTokens.AddAsync(newRefreshToken);

        await _refreshTokens.SaveChangesAsync();

       
        return new AuthResponse(
            accessToken,
            newRefreshToken.Token,
           _jwtProvider.ExpiresIn);
    }
}