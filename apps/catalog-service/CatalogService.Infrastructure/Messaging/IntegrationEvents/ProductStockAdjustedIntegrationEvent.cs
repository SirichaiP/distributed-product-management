namespace CatalogService.Infrastructure.Messaging.IntegrationEvents;

public sealed record ProductStockAdjustedIntegrationEvent(
    Guid ProductId,
    int Quantity,
    string Type,
    DateTime AdjustedAt);