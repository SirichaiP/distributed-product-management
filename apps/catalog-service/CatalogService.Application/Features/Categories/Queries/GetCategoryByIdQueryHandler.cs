using CatalogService.Application.Features.Categories.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Categories.Queries;

public sealed class GetCategoryByIdQueryHandler
    : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly IApplicationDbContext _context;

    public GetCategoryByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request,CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new CategoryDto(
                x.Id,
                x.Name,
                x.Slug,
                x.Description,
                x.ParentId,
                x.IsActive))
            .FirstOrDefaultAsync(cancellationToken);
    }
}