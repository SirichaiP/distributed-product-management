using CatalogService.Application.Features.Categories.DTOs;
using MediatR;

namespace CatalogService.Application.Features.Categories.Queries;

public sealed record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryDto?>;