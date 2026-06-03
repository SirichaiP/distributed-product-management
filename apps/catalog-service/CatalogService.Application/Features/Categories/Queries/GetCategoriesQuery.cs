using CatalogService.Application.Features.Categories.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Categories.Queries;

public sealed record GetCategoriesQuery(
    string? Search,
    bool? IsActive
) : IRequest<IReadOnlyList<CategoryDto>>;