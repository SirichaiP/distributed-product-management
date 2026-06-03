using CatalogService.Application.Features.Categories.DTOs;
using MediatR;

public sealed record CreateCategoryCommand(
    string Name,
    string Slug,
    string? Description,
    Guid? ParentId) : IRequest<CategoryDto>;