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
            product.Sku,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt,
            product.Images
                .OrderBy(x => x.SortOrder)
                .Select(x => new ProductImageDto(
                    x.Id,
                    x.Url,
                    x.SortOrder,
                    x.IsPrimary))
                .ToList());
    }
}