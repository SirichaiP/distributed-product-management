using CatalogService.Application.Features.Products.DTOs;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Commands;

public sealed class AddProductImageCommandHandler
    : IRequestHandler<AddProductImageCommand, ProductImageDto?>
{
    private readonly IApplicationDbContext _context;

    public AddProductImageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductImageDto?> Handle(AddProductImageCommand request,CancellationToken cancellationToken)
    {
        var productExists = await _context.Products.AnyAsync(x => x.Id == request.ProductId, cancellationToken);

        if (!productExists)
        {
            return null;
        }

        var image = new ProductImage(
            request.ProductId,
            request.Url,
            request.SortOrder,
            request.IsPrimary);

        _context.ProductImages.Add(image);

        await _context.SaveChangesAsync(cancellationToken);

        return new ProductImageDto(
            image.Id,
            image.Url,
            image.SortOrder,
            image.IsPrimary);
    }
}