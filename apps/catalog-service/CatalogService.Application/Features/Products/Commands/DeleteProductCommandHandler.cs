using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Commands.DeleteProduct;
 
public sealed class DeleteProductCommandHandler
    : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteProductCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(
        DeleteProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (product is null)
        {
            return false;
        }

        product.Deactivate();

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}