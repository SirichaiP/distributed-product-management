using AuthService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);


        Task<List<User>> GetAllAsync();

        Task AddAsync(User user);

        Task UpdateAsync(User user);

        Task DeleteAsync(User user);
        Task SaveChangesAsync();

        Task<User?> GetByEmailAsync(string email);

        
    }
}
