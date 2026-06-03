using MediatR;

namespace CatalogService.Application.Features.Products.Commands;

public sealed record DeleteProductCommand(Guid Id) : IRequest<bool>;