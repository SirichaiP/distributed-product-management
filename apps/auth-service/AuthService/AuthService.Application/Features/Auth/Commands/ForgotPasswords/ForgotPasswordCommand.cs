using MediatR;

namespace AuthService.Application.Features.Auth.Commands.ForgotPassword;

public sealed record ForgotPasswordCommand(
    string Email
) : IRequest;