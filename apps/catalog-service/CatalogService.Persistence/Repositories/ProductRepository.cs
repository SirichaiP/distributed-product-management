using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using CatalogService.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Persistence.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly CatalogDbContext _context;

    public ProductRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(string? search,Guid? categoryId,bool? isActive,CancellationToken cancellationToken)
    {
        var query = _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = search.Trim();

            query = query.Where(x =>
                x.Name.Contains(keyword) ||
                x.Slug.Contains(keyword) ||
                x.Sku.Contains(keyword));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(x => x.IsActive == isActive.Value);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(Guid id,CancellationToken cancellationToken)
    {
        return await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Include(x => x.StockReservations)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(Product product,CancellationToken cancellationToken)
    {
        await _context.Products.AddAsync(product, cancellationToken);
    }

    public async Task AddImageAsync(ProductImage image,CancellationToken cancellationToken)
    {
        await _context.ProductImages.AddAsync(image, cancellationToken);
    }

    public async Task AddReservationAsync(StockReservation reservation,CancellationToken cancellationToken)
    {
        await _context.StockReservations.AddAsync(reservation, cancellationToken);
    }

    public void Remove(Product product)
    {
        _context.Products.Remove(product);
    }
}