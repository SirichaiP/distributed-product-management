using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler
    : IRequestHandler<ResetPasswordCommand>
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;

    public ResetPasswordCommandHandler(
        IUserRepository users,
        IPasswordHasher hasher)
    {
        _users = users;
        _hasher = hasher;
    }

    public async Task Handle(ResetPasswordCommand request,CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null)
            throw new NotFoundException("User");

        if (!user.IsPasswordResetTokenValid(request.Token))
            throw new UnauthorizedException("Invalid or expired reset token");

        var passwordHash = _hasher.Hash(request.NewPassword);

        user.ChangePassword(passwordHash);

        await _users.UpdateAsync(user);
    }
}