using CatalogService.API.Contracts.Products;
using CatalogService.Application.Features.Products.Commands;
using CatalogService.Application.Features.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogService.API.Controllers;

[Authorize(Policy = "AuthenticatedUser")]
[ApiController]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? search,[FromQuery] Guid? categoryId,[FromQuery] bool? isActive,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetProductsQuery(search, categoryId, isActive),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProductById(Guid id,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetProductByIdQuery(id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new CreateProductCommand(
                request.CategoryId,
                request.Name,
                request.Slug,
                request.Description,
                request.Price,
                request.Currency,
                request.StockQuantity,
                request.Sku),
            cancellationToken);

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id,UpdateProductRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new UpdateProductCommand(
                id,
                request.CategoryId,
                request.Name,
                request.Slug,
                request.Description,
                request.Price,
                request.Currency,
                request.StockQuantity,
                request.Sku,
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
            new DeleteProductCommand(id),
            cancellationToken);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("{id:guid}/images")]
    public async Task<IActionResult> AddImage(Guid id,AddProductImageRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new AddProductImageCommand(
                id,
                request.Url,
                request.SortOrder,
                request.IsPrimary),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost("{id:guid}/adjust-stock")]
    public async Task<IActionResult> AdjustStock(Guid id,AdjustStockRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new AdjustStockCommand(id,request.Quantity,request.Type),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("{id:guid}/reserve-stock")]
    public async Task<IActionResult> ReserveStock(Guid id,ReserveStockRequest request,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new ReserveStockCommand(
                id,
                request.OrderId,
                request.Quantity,
                request.ExpiresAt),
            cancellationToken);

        if (!result)
        {
            return NotFound();
        }

        return Ok(result);
    }
}