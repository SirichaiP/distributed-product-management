namespace CatalogService.Infrastructure.EventBus;

public interface IEventBus
{
    Task PublishAsync<TEvent>(
        TEvent @event,
        CancellationToken cancellationToken = default)
        where TEvent : class;
}