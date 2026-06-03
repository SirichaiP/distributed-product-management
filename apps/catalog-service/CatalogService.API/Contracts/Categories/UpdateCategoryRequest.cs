namespace CatalogService.API.Contracts.Categories.Requests;

public sealed record UpdateCategoryRequest(
    string Name,
    string Slug,
    string? Description,
    Guid? ParentId,
    bool IsActive);