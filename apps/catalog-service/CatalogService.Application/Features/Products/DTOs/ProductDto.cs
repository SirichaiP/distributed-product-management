namespace CatalogService.Application.Features.Products.DTOs;

public sealed record ProductDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string Slug,
    string? Description,
    decimal Price,
    string Currency,
    int StockQuantity,
    int AvailableQuantity,
    string Sku,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyList<ProductImageDto> Images
);