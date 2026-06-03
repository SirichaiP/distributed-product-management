namespace AuthService.Application.Features.Users.DTOs;

public sealed record UserDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    bool IsActive);