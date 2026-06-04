


using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Application.Features.Products.Commands.ReserveStock;

public sealed class ReserveStockCommandHandler
    : IRequestHandler<ReserveStockCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IProductEventPublisher _publisher;
    public ReserveStockCommandHandler(IApplicationDbContext context, IProductEventPublisher publisher)
    {
        _context = context;
        _publisher = publisher;
    }

    public async Task<bool> Handle(ReserveStockCommand request,CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(x => x.StockReservations)
            .FirstOrDefaultAsync(
                x => x.Id == request.ProductId,
                cancellationToken);

        if (product is null)
        {
            return false;
        }

        if (request.Quantity <= 0)
        {
            throw new InvalidOperationException("Quantity must be greater than zero.");
        }

        if (product.AvailableStock < request.Quantity)
        {
            throw new InvalidOperationException("Insufficient available stock.");
        }
        var expiresAt = DateTime.Now.AddMinutes(15);

        var reservation = new StockReservation(
            request.ProductId,
            request.OrderId,
            request.Quantity,
            expiresAt);

        _context.StockReservations.Add(reservation);

        await _context.SaveChangesAsync(cancellationToken);
        await _publisher.PublishStockReservedAsync(
            request.ProductId,
            request.OrderId,
            request.Quantity,
            request.ExpiresAt,
            cancellationToken);
        return true;
    }
}