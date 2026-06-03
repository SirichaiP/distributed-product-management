namespace CatalogService.Infrastructure.Messaging.IntegrationEvents;

public sealed record ProductStockReservedIntegrationEvent(
    Guid ProductId,
    Guid OrderId,
    int Quantity,
    DateTime ReservedAt,
    DateTime ExpiresAt);