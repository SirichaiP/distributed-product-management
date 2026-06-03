using CatalogService.Application.Features.Products.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Products.Commands;

public sealed record AddProductImageCommand(
    Guid ProductId,
    string Url,
    int SortOrder,
    bool IsPrimary
) : IRequest<ProductImageDto?>;