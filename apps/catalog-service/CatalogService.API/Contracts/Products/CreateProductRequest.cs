namespace CatalogService.API.Contracts.Products
{
    public sealed record CreateProductRequest(
    Guid CategoryId,
    string Name,
    string Slug,
    string Description,
    decimal Price,
    string Currency,
    int StockQuantity,
    string Sku);
}
