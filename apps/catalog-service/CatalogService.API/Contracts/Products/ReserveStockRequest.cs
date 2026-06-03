namespace CatalogService.API.Contracts.Products;

public sealed class ReserveStockRequest
{
    public Guid OrderId { get; set; }

    public int Quantity { get; set; }

    public DateTime ExpiresAt { get; set; }
}