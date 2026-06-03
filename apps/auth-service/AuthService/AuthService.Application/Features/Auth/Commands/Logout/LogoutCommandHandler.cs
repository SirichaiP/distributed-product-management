using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands.Logout;

public sealed class LogoutCommandHandler
    : IRequestHandler<LogoutCommand>
{
    private readonly IRefreshTokenRepository _refreshTokens;

    public LogoutCommandHandler(IRefreshTokenRepository refreshTokens)
    {
        _refreshTokens = refreshTokens;
    }

    public async Task Handle(LogoutCommand request,CancellationToken cancellationToken)
    {
        var refreshToken = await _refreshTokens.GetByTokenAsync(request.RefreshToken);

        if (refreshToken is null)
        {
            throw new NotFoundException("Refresh Token");
        }

        refreshToken.Revoke();

        await _refreshTokens.UpdateAsync(refreshToken);
    }
}