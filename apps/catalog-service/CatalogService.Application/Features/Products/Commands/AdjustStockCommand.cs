using CatalogService.Application.Features.Products.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Products.Commands;

public sealed record AdjustStockCommand(
    Guid ProductId,
    int Quantity,
    string Type
) : IRequest<ProductDto?>;