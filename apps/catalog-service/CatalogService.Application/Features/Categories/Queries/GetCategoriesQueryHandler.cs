using CatalogService.Application.Features.Categories.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Categories.Queries;

public sealed class GetCategoriesQueryHandler
    : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCategoriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<CategoryDto>> Handle(GetCategoriesQuery request,CancellationToken cancellationToken)
    {
        var query = _context.Categories.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();

            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Slug.Contains(search) ||
                x.Description.Contains(search));
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == request.IsActive.Value);
        }

        return await query
            .OrderByDescending(x => x.IsActive)
            .ThenBy(x => x.Name)
            .Select(x => new CategoryDto(
                x.Id,
                x.Name,
                x.Slug,
                x.Description,
                x.ParentId,
                x.IsActive))
            .ToListAsync(cancellationToken);
    }
}