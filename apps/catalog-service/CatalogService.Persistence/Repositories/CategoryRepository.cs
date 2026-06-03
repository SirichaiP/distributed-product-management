using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using CatalogService.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Persistence.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly CatalogDbContext _context;

    public CategoryRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Category>> GetAllAsync(string? search,bool? isActive,CancellationToken cancellationToken)
    {
        var query = _context.Categories.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = search.Trim();

            query = query.Where(x =>
                x.Name.Contains(keyword) ||
                x.Slug.Contains(keyword));
        }

        if (isActive.HasValue)
        {
            query = query.Where(x => x.IsActive == isActive.Value);
        }

        return await query
            .OrderByDescending(x => x.IsActive)
            .ThenBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Category?> GetByIdAsync(Guid id,CancellationToken cancellationToken)
    {
        return await _context.Categories
            .Include(x => x.Products)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(Category category,CancellationToken cancellationToken)
    {
        await _context.Categories.AddAsync(category, cancellationToken);
    }

    public void Remove(Category category)
    {
        _context.Categories.Remove(category);
    }
}