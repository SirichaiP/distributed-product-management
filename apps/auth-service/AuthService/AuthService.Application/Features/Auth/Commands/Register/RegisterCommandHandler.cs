using AuthService.Application.Features.Auth.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Application.Exceptions;
using MediatR;


namespace AuthService.Application.Features.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler
        : IRequestHandler<RegisterCommand, RegisterResponse>
    {
        private readonly IUserRepository _users;
        private readonly IJwtProvider _jwt;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IRefreshTokenProvider _refreshTokenProvider;
        private readonly IRefreshTokenRepository _refreshTokens;

        public RegisterCommandHandler(IUserRepository users,IJwtProvider jwt, IPasswordHasher passwordHasher)
        {
            _users = users;
            _jwt = jwt;
            _passwordHasher = passwordHasher;
        }

        public async Task<RegisterResponse> Handle(RegisterCommand request,CancellationToken cancellationToken)
        {
            var email = request.Email.Trim().ToLowerInvariant();

            var fullName = request.FullName.Trim();


            var existingUser =await _users.GetByEmailAsync(email, cancellationToken);

            if (existingUser is not null)
                throw new DuplicateEmailException(email);

            var passwordHash = _passwordHasher.Hash(request.Password);

            var user = new User(email, passwordHash, fullName);

            await _users.AddAsync(user);
            await _users.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            return new RegisterResponse(
             user.Id,
             user.Email,
             user.FullName,
             "Register successful. Please login.");
        }
    }
}