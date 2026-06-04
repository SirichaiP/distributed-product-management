using CatalogService.Application.Features.Products.DTOs;
using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Commands;

public sealed class UpdateProductCommandHandler
    : IRequestHandler<UpdateProductCommand, ProductDto?>
{
    private readonly IApplicationDbContext _context;

    public UpdateProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductDto?> Handle(UpdateProductCommand request,CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (product is null)
        {
            return null;
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(x => x.Id == request.CategoryId, cancellationToken);

        if (category is null)
        {
            throw new InvalidOperationException("Category not found.");
        }

        product.Update(
            request.CategoryId,
            request.Name,
            request.Slug,
            request.Description,
            request.Price,
            request.Currency,
            request.StockQuantity,
            request.Sku,
            request.IsActive);

        await _context.SaveChangesAsync(cancellationToken);
        var reservedQuantity = await _context.StockReservations
    .AsNoTracking()
    .Where(x =>
        x.ProductId == product.Id &&
        x.Status == "Reserved" &&
        (
            x.ExpiresAt == default ||
            x.ExpiresAt > DateTime.Now
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