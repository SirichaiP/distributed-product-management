using CatalogService.Domain.Common;

namespace CatalogService.Domain.Entities;

public sealed class ProductImage : BaseEntity
{
    private ProductImage() { }

    public ProductImage(Guid productId, string url, int sortOrder, bool isPrimary)
    {
        ProductId = productId;
        Url = url;
        SortOrder = sortOrder;
        IsPrimary = isPrimary;
    }

    public Guid ProductId { get; private set; }
    public string Url { get; private set; } = string.Empty;
    public int SortOrder { get; private set; }
    public bool IsPrimary { get; private set; }

    public Product Product { get; private set; } = null!;
}