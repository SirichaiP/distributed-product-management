using AuthService.Application.Common.Exceptions;
using AuthService.Application.Features.Users.DTOs;
using AuthService.Application.Interfaces;
using MediatR;

namespace AuthService.Application.Features.Users.Queries;

public sealed class GetCurrentUserQueryHandler
    : IRequestHandler<GetCurrentUserQuery, UserDto>
{
    private readonly IUserRepository _users;

    public GetCurrentUserQueryHandler(
        IUserRepository users)
    {
        _users = users;
    }

    public async Task<UserDto> Handle(GetCurrentUserQuery request,CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId);

        if (user is null)
        {
            throw new NotFoundException("User");
        }

        return new UserDto(user.Id,user.FullName,user.Email,user.Role,user.IsActive);
    }
}