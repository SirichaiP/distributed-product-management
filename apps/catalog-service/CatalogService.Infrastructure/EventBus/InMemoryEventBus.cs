using Microsoft.Extensions.Logging;

namespace CatalogService.Infrastructure.EventBus;

public sealed class InMemoryEventBus : IEventBus
{
    private readonly ILogger<InMemoryEventBus> _logger;

    public InMemoryEventBus(ILogger<InMemoryEventBus> logger)
    {
        _logger = logger;
    }

    public Task PublishAsync<TEvent>(
        TEvent @event,
        CancellationToken cancellationToken = default)
        where TEvent : class
    {
        _logger.LogInformation(
            "Published integration event: {EventName} {@Event}",
            typeof(TEvent).Name,
            @event);

        return Task.CompletedTask;
    }
}