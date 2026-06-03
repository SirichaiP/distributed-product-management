using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using MediatR;
using AuthService.Application.Features.Users.DTOs;

namespace AuthService.Application.Features.Users.Queries
{
    public sealed class GetUserByIdQueryHandler
     : IRequestHandler<GetUserByIdQuery, UserDto>
    {
        private readonly IUserRepository _users;

        public GetUserByIdQueryHandler(IUserRepository users)
        {
            _users = users;
        }

        public async Task<UserDto> Handle(GetUserByIdQuery request,CancellationToken cancellationToken)
        {
            var user = await _users.GetByIdAsync(request.Id);

            if (user is null)
                throw new NotFoundException("User");

            return new UserDto(user.Id,user.FullName,user.Email,user.Role,user.IsActive);
        }
    }
}
