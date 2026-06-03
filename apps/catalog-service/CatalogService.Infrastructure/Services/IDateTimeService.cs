namespace CatalogService.Infrastructure.Services;

public interface IDateTimeService
{
    DateTime UtcNow { get; }
}