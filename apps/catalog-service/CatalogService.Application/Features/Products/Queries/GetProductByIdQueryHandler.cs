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

    public async Task<ProductDto?> Handle(GetProductByIdQuery request,CancellationToken cancellationToken)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Where(x => x.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);
    }
}