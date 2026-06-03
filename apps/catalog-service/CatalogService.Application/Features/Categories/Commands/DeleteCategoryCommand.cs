using MediatR;

namespace CatalogService.Application.Features.Categories.Commands;

public sealed record DeleteCategoryCommand(
    Guid Id
) : IRequest<bool>;