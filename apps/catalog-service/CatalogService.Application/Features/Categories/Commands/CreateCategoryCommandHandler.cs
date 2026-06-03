using CatalogService.Application.Features.Categories.DTOs;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using MediatR;

namespace CatalogService.Application.Features.Categories.Commands;

public sealed class CreateCategoryCommandHandler
    : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly IApplicationDbContext _context;

    public CreateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request,CancellationToken cancellationToken)
    {
        var category = new Category(
            request.Name,
            request.Slug,
            request.Description,
            request.ParentId);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        return new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ParentId,
            category.IsActive);
    }
}