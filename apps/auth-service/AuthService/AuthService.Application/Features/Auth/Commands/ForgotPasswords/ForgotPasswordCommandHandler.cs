using AuthService.Application.Features.Auth.Commands.ForgotPassword;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using MediatR;
using System.Security.Cryptography;

public sealed class ForgotPasswordCommandHandler
    : IRequestHandler<ForgotPasswordCommand>
{
    private readonly IUserRepository _users;
    private readonly IPasswordResetTokenRepository _tokens;
    private readonly IEmailService _emailService;

    public ForgotPasswordCommandHandler(
        IUserRepository users,
        IPasswordResetTokenRepository tokens,
        IEmailService emailService)
    {
        _users = users;
        _tokens = tokens;
        _emailService = emailService;
    }

    public async Task Handle(ForgotPasswordCommand request,CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email);

        if (user is null)
            return;

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)
        );

        var resetToken = PasswordResetToken.Create(user.Id, token);

        await _tokens.AddAsync(resetToken);

        var resetUrl =
            $"http://localhost:3000/reset-password?token={Uri.EscapeDataString(token)}";

        await _emailService.SendAsync(
            user.Email,
            "Reset your password",
            $"Click this link to reset password: {resetUrl}"
        );
    }
}