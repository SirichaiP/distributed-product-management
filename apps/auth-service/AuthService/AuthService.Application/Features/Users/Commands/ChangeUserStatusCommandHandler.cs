using AuthService.Application.Common.Exceptions;
using AuthService.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Features.Users.Commands
{
    public sealed class ChangeUserStatusCommandHandler
      : IRequestHandler<ChangeUserStatusCommand>
    {
        private readonly IUserRepository _users;

        public ChangeUserStatusCommandHandler(IUserRepository users)
        {
            _users = users;
        }

        public async Task Handle(ChangeUserStatusCommand request,CancellationToken cancellationToken)
        {
            var user =await _users.GetByIdAsync(request.Id);

            if (user is null)
                throw new NotFoundException("User");

            if (request.IsActive)
                user.Activate();
            else
                user.Deactivate();

            await _users.UpdateAsync(user);
        }
    }
}

