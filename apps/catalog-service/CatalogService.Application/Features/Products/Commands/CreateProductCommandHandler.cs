using CatalogService.Application.Features.Products.DTOs;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Commands;

public sealed class CreateProductCommandHandler
    : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IProductEventPublisher _publisher;

    public CreateProductCommandHandler(
        IApplicationDbContext context,
        IProductEventPublisher publisher)
    {
        _context = context;
        _publisher = publisher;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request,CancellationToken cancellationToken)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(x => x.Id == request.CategoryId, cancellationToken);

        if (category is null)
        {
            throw new InvalidOperationException("Category not found.");
        }

        var product = new Product(
            request.CategoryId,
            request.Name,
            request.Slug,
            request.Description,
            request.Price,
            request.Currency,
            request.StockQuantity,
            request.Sku);

        _context.Products.Add(product);

        await _context.SaveChangesAsync(cancellationToken);

        await _publisher.PublishProductCreatedAsync(
            product.Id,
            product.CategoryId,
            product.Name,
            product.Sku,
            product.Price,
            product.Currency,
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
            product.StockQuantity,
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