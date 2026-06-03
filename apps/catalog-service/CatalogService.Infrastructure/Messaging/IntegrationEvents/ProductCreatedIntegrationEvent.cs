namespace CatalogService.Infrastructure.Messaging.IntegrationEvents;

public sealed record ProductCreatedIntegrationEvent(
    Guid ProductId,
    Guid CategoryId,
    string Name,
    string Sku,
    decimal Price,
    string Currency,
    DateTime CreatedAt);