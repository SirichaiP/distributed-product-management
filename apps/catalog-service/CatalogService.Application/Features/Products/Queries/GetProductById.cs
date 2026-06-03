using CatalogService.Application.Features.Products.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Products.Queries;

public sealed record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>;