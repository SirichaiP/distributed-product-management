using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using MediatR;


namespace AuthService.Application.Features.Users.Commands
{
    public sealed class DeleteUserCommandHandler
     : IRequestHandler<DeleteUserCommand>
    {
        private readonly IUserRepository _users;

        public DeleteUserCommandHandler(IUserRepository users)
        {
            _users = users;
        }

        public async Task Handle(DeleteUserCommand request,CancellationToken cancellationToken)
        {
            var user = await _users.GetByIdAsync(request.Id);

            if (user is null)
                throw new NotFoundException("User");

            await _users.DeleteAsync(user);
        }
    }
}
