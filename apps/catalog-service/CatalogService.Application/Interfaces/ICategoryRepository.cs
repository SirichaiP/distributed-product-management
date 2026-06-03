using CatalogService.Domain.Entities;

namespace CatalogService.Application.Interfaces;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> GetAllAsync(string? search,bool? isActive,CancellationToken cancellationToken);

    Task<Category?> GetByIdAsync(Guid id,CancellationToken cancellationToken);

    Task AddAsync(Category category,CancellationToken cancellationToken);

    void Remove(Category category);
}