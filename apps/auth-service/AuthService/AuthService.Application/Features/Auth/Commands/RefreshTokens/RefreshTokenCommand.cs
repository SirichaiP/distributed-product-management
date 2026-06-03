using AuthService.Application.Features.Auth.DTOs;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands.RefreshTokens;

public sealed record RefreshTokenCommand(
    string RefreshToken
) : IRequest<AuthResponse>;