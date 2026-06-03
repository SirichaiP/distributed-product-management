using MediatR;

namespace CatalogService.Application.Features.Products.Commands;

public sealed record ReserveStockCommand(
    Guid ProductId,
    Guid OrderId,
    int Quantity,
    DateTime ExpiresAt
) : IRequest<bool>;