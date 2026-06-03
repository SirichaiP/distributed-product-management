using MediatR;


namespace AuthService.Application.Features.Users.Commands
{
    public sealed record UpdateUserCommand(
    Guid Id,
    string FullName,
    string Role)
    : IRequest;
}
