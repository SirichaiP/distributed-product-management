using CatalogService.Domain.Common;

namespace CatalogService.Domain.Entities;

public sealed class Product : BaseEntity
{
    private readonly List<ProductImage> _images = new();
    private readonly List<StockReservation> _stockReservations = new();

    private Product() { }

    public Product(
        Guid categoryId,
        string name,
        string slug,
        string description,
        decimal price,
        string currency,
        int stockQuantity,
        string sku)
    {
        CategoryId = categoryId;
        Name = name;
        Slug = slug;
        Description = description;
        Price = price;
        Currency = currency;
        StockQuantity = stockQuantity;
        Sku = sku;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public Guid CategoryId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public string Currency { get; private set; } = "THB";
    public int StockQuantity { get; private set; }
    public string Sku { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public Category Category { get; private set; } = null!;
    public IReadOnlyCollection<ProductImage> Images => _images;
    public IReadOnlyCollection<StockReservation> StockReservations => _stockReservations;

    public int ReservedQuantity =>
        _stockReservations
            .Where(x => x.Status == "Reserved" && x.ExpiresAt > DateTime.UtcNow)
            .Sum(x => x.Quantity);

    public int AvailableStock => StockQuantity - ReservedQuantity;

    public void Update(
        Guid categoryId,
        string name,
        string slug,
        string description,
        decimal price,
        string currency,
        int stockQuantity,
        string sku,
        bool isActive)
    {
        CategoryId = categoryId;
        Name = name;
        Slug = slug;
        Description = description;
        Price = price;
        Currency = currency;
        StockQuantity = stockQuantity;
        Sku = sku;
        IsActive = isActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0) throw new InvalidOperationException("Quantity must be greater than zero.");

        StockQuantity += quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DecreaseStock(int quantity)
    {
        if (quantity <= 0) throw new InvalidOperationException("Quantity must be greater than zero.");
        if (AvailableStock < quantity) throw new InvalidOperationException("Insufficient available stock.");

        StockQuantity -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;
}