using AuthService.API.Contracts.Auth;
using AuthService.Application.Features.Auth.Commands.ForgotPassword;
using AuthService.Application.Features.Auth.Commands.Login;
using AuthService.Application.Features.Auth.Commands.Logout;
using AuthService.Application.Features.Auth.Commands.RefreshTokens;
using AuthService.Application.Features.Auth.Commands.Register;
using AuthService.Application.Features.Auth.Commands.ResetPassword;
using AuthService.Application.Features.Users.Queries;
using Azure.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthService.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController
    : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult>Register(RegisterRequest request)
        {

            var result = await _mediator.Send(new RegisterCommand(
                   request.FullName,
                   request.Email,
                   request.Password));      
            return Ok(result);
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshTokenRequest request)
        {
            var result = await _mediator.Send(new RefreshTokenCommand(request.RefreshToken));

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult>Login(LoginRequest request)
        {
            var result = await _mediator.Send(new LoginCommand(
                    request.Email,
                    request.Password,
                     request.RememberMe
                ));

            return Ok(result);
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
                return Unauthorized();

            var result = await _mediator.Send(new GetCurrentUserQuery(Guid.Parse(userId)));

            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(LogoutRequest request)
        {
            await _mediator.Send(new LogoutCommand(request.RefreshToken));

            return NoContent();
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            await _mediator.Send(new ForgotPasswordCommand(request.Email));

            return Ok(new
            {
                message = "If the email exists, password reset instructions have been sent."
            });
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            ResetPasswordRequest request)
        {
            await _mediator.Send(new ResetPasswordCommand(
                    request.Email,
                    request.Token,
                    request.NewPassword));

            return NoContent();
        }
    }
}
