using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Persistence.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AuthDbContext _context;

    public UserRepository(AuthDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email,CancellationToken cancellationToken)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Email == email,cancellationToken);
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.AsNoTracking().OrderBy(x => x.FullName).ToListAsync();
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public Task UpdateAsync(User user)
    {
        _context.Users.Update(user);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(User user)
    {
        _context.Users.Remove(user);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
    }
}