using CatalogService.API.Contracts.Categories.Requests;
using CatalogService.Application.Features.Categories.Commands;
using CatalogService.Application.Features.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogService.API.Controllers;

[Authorize(Policy = "AuthenticatedUser")]
[ApiController]
[Route("api/categories")]
public sealed class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories([FromQuery] string? search,[FromQuery] bool? isActive,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetCategoriesQuery(search, isActive),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCategoryById(Guid id,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetCategoryByIdQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new CreateCategoryCommand(
                request.Name,
                request.Slug,
                 request.Description,
                request.ParentId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id,UpdateCategoryRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new UpdateCategoryCommand(
                id,
                request.Name,
                request.Slug,
                request.Description,
                request.ParentId,
                request.IsActive),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DeleteCategoryCommand(id),
            cancellationToken);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}