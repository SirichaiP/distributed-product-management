using MediatR;

namespace AuthService.Application.Features.Auth.Commands.ResetPassword;

public sealed record ResetPasswordCommand(
    string Email,
    string Token,
    string NewPassword
) : IRequest;