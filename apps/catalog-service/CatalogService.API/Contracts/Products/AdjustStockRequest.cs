namespace CatalogService.API.Contracts.Products;

public sealed record AdjustStockRequest(
    int Quantity,
    string Type
);