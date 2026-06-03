using AuthService.Application.Features.Users.DTOs;
using MediatR;

namespace AuthService.Application.Features.Users.Queries;

public sealed record GetCurrentUserQuery(
    Guid UserId
) : IRequest<UserDto>;