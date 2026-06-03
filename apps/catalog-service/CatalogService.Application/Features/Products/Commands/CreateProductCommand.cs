using CatalogService.Application.Features.Products.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Products.Commands;

public sealed record CreateProductCommand(
    Guid CategoryId,
    string Name,
    string Slug,
    string Description,
    decimal Price,
    string Currency,
    int StockQuantity,
    string Sku
) : IRequest<ProductDto>;