using AuthService.Application.Features.Users.DTOs;
using AuthService.Application.Interfaces;
using MediatR;

namespace AuthService.Application.Features.Users.Queries;

public sealed class GetUsersQueryHandler
    : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly IUserRepository _users;

    public GetUsersQueryHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<List<UserDto>> Handle(GetUsersQuery request,CancellationToken cancellationToken)
    {
        var users = await _users.GetAllAsync();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            users = users.Where(x =>x.FullName.Contains(request.Search,StringComparison.OrdinalIgnoreCase)
                    ||x.Email.Contains(request.Search,StringComparison.OrdinalIgnoreCase)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            users = users.Where(x =>x.Role.Equals(request.Role,StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return users.Select(x => new UserDto(x.Id,x.FullName,x.Email,x.Role,x.IsActive)).ToList();
    }
}