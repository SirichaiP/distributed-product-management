using AuthService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Interfaces
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token);
        Task<PasswordResetToken?> GetByTokenAsync(string token);
        Task UpdateAsync(PasswordResetToken token);
    }
}
