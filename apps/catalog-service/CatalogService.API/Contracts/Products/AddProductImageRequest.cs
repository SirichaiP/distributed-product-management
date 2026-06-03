namespace CatalogService.API.Contracts.Products;

public sealed record AddProductImageRequest(
    string Url,
    int SortOrder,
    bool IsPrimary
);