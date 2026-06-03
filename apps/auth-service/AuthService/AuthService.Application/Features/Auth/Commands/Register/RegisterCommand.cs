using AuthService.Application.Features.Auth.DTOs;
using MediatR;

namespace AuthService.Application.Features.Auth.Commands.Register
{

    public sealed record RegisterCommand(
      string FullName,
      string Email,
      string Password)
  : IRequest<RegisterResponse>;
}
