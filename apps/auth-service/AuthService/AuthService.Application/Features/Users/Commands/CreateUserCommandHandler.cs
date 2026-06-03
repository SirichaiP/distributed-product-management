using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using MediatR;


namespace AuthService.Application.Features.Users.Commands
{
    public sealed class CreateUserCommandHandler
     : IRequestHandler<CreateUserCommand, Guid>
    {
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _hasher;

        public CreateUserCommandHandler(
            IUserRepository users,
            IPasswordHasher hasher)
        {
            _users = users;
            _hasher = hasher;
        }

        public async Task<Guid> Handle(CreateUserCommand request,CancellationToken cancellationToken)
        {
            var exist =await _users.GetByEmailAsync(request.Email,cancellationToken);

            if (exist != null)
                throw new ConflictException("Email already exists");

            var user = User.Create(request.FullName,request.Email,_hasher.Hash(request.Password),request.Role);

            await _users.AddAsync(user);

            return user.Id;
        }
    }
}
