using CatalogService.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Categories.Commands;

public sealed class DeleteCategoryCommandHandler
    : IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteCategoryCommand request,CancellationToken cancellationToken)
    {
        var category = await _context.Categories
            .Include(x => x.Products)
            .FirstOrDefaultAsync(
                x => x.Id == request.Id,
                cancellationToken);

        if (category is null)
        {
            return false;
        }

        // ป้องกันการลบหมวดที่มีสินค้าอยู่
        if (category.Products.Any())
        {
            throw new InvalidOperationException(
                "Cannot delete category because it contains products.");
        }

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}