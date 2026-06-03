using CatalogService.Application.Interfaces;
using CatalogService.Infrastructure.EventBus;
using CatalogService.Infrastructure.Messaging.IntegrationEvents;

namespace CatalogService.Infrastructure.Messaging.Publishers;

public sealed class ProductEventPublisher : IProductEventPublisher
{
    private readonly IEventBus _eventBus;

    public ProductEventPublisher(IEventBus eventBus)
    {
        _eventBus = eventBus;
    }

    public Task PublishProductCreatedAsync(Guid productId,Guid categoryId,string name,string sku,decimal price,string currency,CancellationToken cancellationToken = default)
    {
        var @event = new ProductCreatedIntegrationEvent(
            productId,
            categoryId,
            name,
            sku,
            price,
            currency,
            DateTime.UtcNow);

        return _eventBus.PublishAsync(@event, cancellationToken);
    }

    public Task PublishStockReservedAsync(Guid productId,Guid orderId,int quantity,DateTime expiresAt,
        CancellationToken cancellationToken = default)
    {
        var @event = new ProductStockReservedIntegrationEvent(
            productId,
            orderId,
            quantity,
            DateTime.UtcNow,
            expiresAt);

        return _eventBus.PublishAsync(@event, cancellationToken);
    }

    public Task PublishStockAdjustedAsync(Guid productId,int quantity,string type,
        CancellationToken cancellationToken = default)
    {
        var @event = new ProductStockAdjustedIntegrationEvent(
            productId,
            quantity,
            type,
            DateTime.UtcNow);

        return _eventBus.PublishAsync(@event, cancellationToken);
    }
}