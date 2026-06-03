using AuthService.Application.Features.Users.DTOs;
using MediatR;

namespace AuthService.Application.Features.Users.Queries;

public sealed record GetUsersQuery(
    string? Search,
    string? Role
) : IRequest<List<UserDto>>;