namespace CatalogService.Application.Interfaces;

public interface IProductEventPublisher
{
    Task PublishProductCreatedAsync(Guid productId,Guid categoryId,string name,string sku,decimal price,string currency,CancellationToken cancellationToken = default);

    Task PublishStockAdjustedAsync(Guid productId,int quantity,string type,CancellationToken cancellationToken = default);

    Task PublishStockReservedAsync(Guid productId,Guid orderId,int quantity,DateTime expiresAt,CancellationToken cancellationToken = default);
}