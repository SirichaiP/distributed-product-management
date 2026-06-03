using CatalogService.Application.Features.Products.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Products.Queries;

public sealed record GetProductsQuery(
    string? Search,
    Guid? CategoryId,
    bool? IsActive
) : IRequest<IReadOnlyList<ProductDto>>;