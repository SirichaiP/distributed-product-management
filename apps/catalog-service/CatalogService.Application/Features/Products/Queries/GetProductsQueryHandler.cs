using CatalogService.Application.Features.Products.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Queries;

public sealed class GetProductsQueryHandler
    : IRequestHandler<GetProductsQuery, IReadOnlyList<ProductDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProductsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<ProductDto>> Handle(
        GetProductsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Images)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();

            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Slug.Contains(search) ||
                x.Sku.Contains(search));
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == request.CategoryId.Value);
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == request.IsActive.Value);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ProductDto(
                x.Id,
                x.CategoryId,
                x.Category.Name,
                x.Name,
                x.Slug,
                x.Description,
                x.Price,
                x.Currency,
                x.StockQuantity,
                x.Sku,
                x.IsActive,
                x.CreatedAt,
                x.UpdatedAt,
                x.Images
                    .OrderBy(i => i.SortOrder)
                    .Select(i => new ProductImageDto(
                        i.Id,
                        i.Url,
                        i.SortOrder,
                        i.IsPrimary))
                    .ToList()))
            .ToListAsync(cancellationToken);
    }
}