using AuthService.Application.Features.Auth.Commands.Register;
using FluentValidation;

public class RegisterCommandValidator
    : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty()
            .WithMessage("Full name is required.")
            .MaximumLength(200)
            .WithMessage("Full name must not exceed 200 characters.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .MaximumLength(255)
            .WithMessage("Email must not exceed 255 characters.")
            .EmailAddress()
            .WithMessage("Email format is invalid.")
            .Must(email => !ContainsDangerousSqlPattern(email))
            .WithMessage("Email contains invalid characters.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]")
            .WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]")
            .WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]")
            .WithMessage("Password must contain at least one number.")
            .Matches("[^a-zA-Z0-9]")
            .WithMessage("Password must contain at least one special character.");
    }

    private static bool ContainsDangerousSqlPattern(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        var lower = value.ToLowerInvariant();

        return lower.Contains("'")
            || lower.Contains("--")
            || lower.Contains(";")
            || lower.Contains(" drop ")
            || lower.Contains(" delete ")
            || lower.Contains(" insert ")
            || lower.Contains(" update ")
            || lower.Contains(" select ");
    }
}