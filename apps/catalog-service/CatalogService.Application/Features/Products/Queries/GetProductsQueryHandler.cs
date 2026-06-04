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
        var now = DateTime.UtcNow;

        var reservedStockQuery =
            _context.StockReservations
                .AsNoTracking()
                .Where(x =>
                    x.Status == "Reserved" &&
                    (
                        x.ExpiresAt == default ||
                        x.ExpiresAt > now
                    ))
                .GroupBy(x => x.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    ReservedQuantity = g.Sum(x => x.Quantity)
                });

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
            .GroupJoin(
                reservedStockQuery,
                product => product.Id,
                reservation => reservation.ProductId,
                (product, reservations) => new
                {
                    Product = product,
                    ReservedQuantity = reservations
                        .Select(r => r.ReservedQuantity)
                        .FirstOrDefault()
                })
            .Select(x => new ProductDto(
                x.Product.Id,
                x.Product.CategoryId,
                x.Product.Category.Name,
                x.Product.Name,
                x.Product.Slug,
                x.Product.Description,
                x.Product.Price,
                x.Product.Currency,
                x.Product.StockQuantity,
                Math.Max(x.Product.StockQuantity - x.ReservedQuantity, 0),
                x.Product.Sku,
                x.Product.IsActive,
                x.Product.CreatedAt,
                x.Product.UpdatedAt,
                x.Product.Images
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