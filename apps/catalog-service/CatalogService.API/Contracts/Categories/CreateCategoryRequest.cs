namespace CatalogService.API.Contracts.Categories.Requests;

public sealed record CreateCategoryRequest(
    string Name,
    string Slug,
    string? Description,
    Guid? ParentId);