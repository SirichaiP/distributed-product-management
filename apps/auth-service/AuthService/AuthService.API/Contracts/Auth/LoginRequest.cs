namespace AuthService.API.Contracts.Auth;

public sealed record LoginRequest(
    string Email,
    string Password,
    bool RememberMe
);