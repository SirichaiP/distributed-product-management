namespace CatalogService.Application.Features.Categories.DTOs;

public sealed record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    Guid? ParentId,
    bool IsActive);