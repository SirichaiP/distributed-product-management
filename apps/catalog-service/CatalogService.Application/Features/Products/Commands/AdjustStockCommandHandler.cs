using CatalogService.Application.Features.Products.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Commands;

public sealed class AdjustStockCommandHandler
    : IRequestHandler<AdjustStockCommand, ProductDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IProductEventPublisher _publisher;
    public AdjustStockCommandHandler(IApplicationDbContext context, IProductEventPublisher publisher)
    {
        _context = context;
        _publisher = publisher;
    }

    public async Task<ProductDto?> Handle(AdjustStockCommand request,CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Include(x => x.StockReservations)
            .FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken);

        if (product is null)
        {
            return null;
        }

        var type = request.Type.Trim().ToLower();

        if (type is "increase" or "in")
        {
            product.IncreaseStock(request.Quantity);
        }
        else if (type is "decrease" or "out")
        {
            product.DecreaseStock(request.Quantity);
        }
        else
        {
            throw new InvalidOperationException("Stock type must be increase or decrease.");
        }

        await _context.SaveChangesAsync(cancellationToken);
        await _publisher.PublishStockAdjustedAsync(
            product.Id,
            request.Quantity,
            request.Type,
            cancellationToken);

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