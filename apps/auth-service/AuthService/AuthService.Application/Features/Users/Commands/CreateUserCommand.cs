using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Features.Users.Commands
{
    public sealed record CreateUserCommand(
      string FullName,
      string Email,
      string Password,
      string Role)
      : IRequest<Guid>;
}
