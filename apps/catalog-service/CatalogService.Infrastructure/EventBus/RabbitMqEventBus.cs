using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace CatalogService.Infrastructure.EventBus;

public sealed class RabbitMqEventBus : IEventBus, IAsyncDisposable
{
    private readonly RabbitMqSettings _settings;
    private readonly ILogger<RabbitMqEventBus> _logger;
    private readonly IConnection _connection;
    private readonly IChannel _channel;

    public RabbitMqEventBus(
        IOptions<RabbitMqSettings> options,
        ILogger<RabbitMqEventBus> logger)
    {
        _settings = options.Value;
        _logger = logger;

        var factory = new ConnectionFactory
        {
            HostName = _settings.HostName,
            Port = _settings.Port,
            UserName = _settings.UserName,
            Password = _settings.Password
        };

        _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
        _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();

        _channel.ExchangeDeclareAsync(
            exchange: _settings.ExchangeName,
            type: ExchangeType.Topic,
            durable: true,
            autoDelete: false
        ).GetAwaiter().GetResult();
    }

    public async Task PublishAsync<TEvent>(
        TEvent @event,
        CancellationToken cancellationToken = default)
        where TEvent : class
    {
        var eventName = typeof(TEvent).Name;
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(@event));

        var properties = new BasicProperties
        {
            Persistent = true,
            ContentType = "application/json",
            Type = eventName,
            MessageId = Guid.NewGuid().ToString(),
            Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds())
        };

        await _channel.BasicPublishAsync(
            exchange: _settings.ExchangeName,
            routingKey: eventName,
            mandatory: false,
            basicProperties: properties,
            body: body,
            cancellationToken: cancellationToken);

        _logger.LogInformation(
            "Published RabbitMQ event {EventName}",
            eventName);
    }

    public async ValueTask DisposeAsync()
    {
        await _channel.DisposeAsync();
        await _connection.DisposeAsync();
    }
}