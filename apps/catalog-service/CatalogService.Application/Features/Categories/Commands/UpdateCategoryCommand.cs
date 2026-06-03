using CatalogService.Application.Features.Categories.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Categories.Commands;

public sealed record UpdateCategoryCommand(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    Guid? ParentId,
    bool IsActive) : IRequest<CategoryDto?>;