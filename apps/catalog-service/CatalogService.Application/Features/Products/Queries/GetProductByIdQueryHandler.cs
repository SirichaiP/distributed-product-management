using CatalogService.Application.Features.Products.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Queries;

public sealed class GetProductByIdQueryHandler
    : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IApplicationDbContext _context;

    public GetProductByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto?> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (product is null)
        {
            return null;
        }

        var now = DateTime.UtcNow;

        var reservedQuantity = await _context.StockReservations
            .AsNoTracking()
            .Where(x =>
                x.ProductId == product.Id &&
                x.Status == "Reserved" &&
                (
                    x.ExpiresAt == default ||
                    x.ExpiresAt > now
                ))
            .SumAsync(x => (int?)x.Quantity, cancellationToken) ?? 0;

        var availableQuantity = Math.Max(
            product.StockQuantity - reservedQuantity,
            0);

        return new ProductDto(
            product.Id,
            product.CategoryId,
            product.Category.Name,
            product.Name,
            product.Slug,
            product.Description,
            product.Price,
            product.Currency,
            product.StockQuantity,
            availableQuantity,
            product.Sku,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt,
            product.Images
                .OrderBy(i => i.SortOrder)
                .Select(i => new ProductImageDto(
                    i.Id,
                    i.Url,
                    i.SortOrder,
                    i.IsPrimary))
                .ToList());
    }
}