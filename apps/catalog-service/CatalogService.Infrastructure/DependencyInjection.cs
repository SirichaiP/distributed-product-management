using CatalogService.Application.Interfaces;
using CatalogService.Infrastructure.EventBus;
using CatalogService.Infrastructure.Messaging.Publishers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CatalogService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<RabbitMqSettings>(
            configuration.GetSection("RabbitMq"));

        services.AddSingleton<IEventBus, RabbitMqEventBus>();
        services.AddScoped<IProductEventPublisher, ProductEventPublisher>();

        return services;
    }
}