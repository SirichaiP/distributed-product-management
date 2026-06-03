using CatalogService.Domain.Common;

namespace CatalogService.Domain.Entities;

public sealed class StockReservation : BaseEntity
{
    private StockReservation() { }

    public StockReservation(Guid productId,Guid orderId,int quantity,DateTime expiresAt)
    {
        ProductId = productId;
        OrderId = orderId;
        Quantity = quantity;
        Status = "Reserved";
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid ProductId { get; private set; }

    public Guid OrderId { get; private set; }

    public int Quantity { get; private set; }

    public string Status { get; private set; } = string.Empty;

    public DateTime ExpiresAt { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public Product Product { get; private set; } = null!;
}