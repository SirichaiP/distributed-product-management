using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using MediatR;


namespace AuthService.Application.Features.Users.Commands
{
    public sealed class UpdateUserCommandHandler
        : IRequestHandler<UpdateUserCommand>
    {
        private readonly IUserRepository _users;

        public UpdateUserCommandHandler(IUserRepository users)
        {
            _users = users;
        }

        public async Task Handle(UpdateUserCommand request,CancellationToken cancellationToken)
        {
            var user =await _users.GetByIdAsync(request.Id);

            if (user is null)
                throw new NotFoundException("User");

            user.Update(
                request.FullName,
                request.Role);

            await _users.UpdateAsync(user);
        }
    }
}
