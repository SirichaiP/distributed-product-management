using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Features.Users.Commands
{
    public sealed record DeleteUserCommand(
       Guid Id)
       : IRequest;
}
