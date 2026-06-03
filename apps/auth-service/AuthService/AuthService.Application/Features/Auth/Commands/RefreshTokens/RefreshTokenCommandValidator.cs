using FluentValidation;

namespace AuthService.Application.Features.Auth.Commands.RefreshTokens;

public sealed class RefreshTokenCommandValidator
    : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty()
            .WithMessage("Refresh token is required.");
    }
}