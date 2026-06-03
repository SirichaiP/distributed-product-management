using CatalogService.Domain.Entities;

namespace CatalogService.Application.Interfaces;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> GetAllAsync(string? search,Guid? categoryId,bool? isActive,CancellationToken cancellationToken);

    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task AddAsync(Product product,CancellationToken cancellationToken);

    Task AddImageAsync(ProductImage image,CancellationToken cancellationToken);

    Task AddReservationAsync(StockReservation reservation,CancellationToken cancellationToken);

    void Remove(Product product);
}