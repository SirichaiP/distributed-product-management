namespace AuthService.Application.Features.Auth.DTOs;

public sealed record RegisterResponse(
    Guid UserId,
    string Email,
    string FullName,
    string Message
);