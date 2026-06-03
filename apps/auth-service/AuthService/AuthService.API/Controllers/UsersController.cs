using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthService.Application.Features.Users.Commands;
using AuthService.Application.Features.Users.Queries;
namespace AuthService.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly ISender _sender;

        public UsersController(ISender sender)
        {
            _sender = sender;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search,[FromQuery] string? role)
        {
            var result = await _sender.Send(new GetUsersQuery(search, role));

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _sender.Send(new GetUserByIdQuery(id)));
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateUserCommand command)
        {
            var id = await _sender.Send(command);

            return Ok(id);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id,UpdateUserCommand command)
        {
            await _sender.Send(command with { Id = id });

            return NoContent();
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _sender.Send(new DeleteUserCommand(id));

            return NoContent();
        }
        [Authorize]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(Guid id,ChangeUserStatusCommand command)
        {
            await _sender.Send(command with { Id = id });

            return NoContent();
        }
    }
}
