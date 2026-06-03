using CatalogService.Application.Features.Categories.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Categories.Commands;

public sealed class UpdateCategoryCommandHandler
    : IRequestHandler<UpdateCategoryCommand, CategoryDto?>
{
    private readonly IApplicationDbContext _context;

    public UpdateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryDto?> Handle(UpdateCategoryCommand request,CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (category is null)
        {
            return null;
        }

        category.Update(
            request.Name,
            request.Slug,
            request.Description,
            request.ParentId,
            request.IsActive);

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