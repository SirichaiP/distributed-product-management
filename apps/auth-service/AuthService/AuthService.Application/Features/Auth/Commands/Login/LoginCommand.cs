using AuthService.Application.Features.Auth.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Features.Auth.Commands.Login
{
public sealed record LoginCommand(
     string Email,
     string Password,
     bool RememberMe)
 : IRequest<AuthResponse>;
}
