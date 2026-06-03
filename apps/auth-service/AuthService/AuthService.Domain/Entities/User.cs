using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }

        public string Email { get; private set; } = default!;

        public string PasswordHash { get; private set; } = default!;

        public string FullName { get; private set; } = default!;

        public string Role { get; private set; } = "User";

        public bool IsActive { get; private set; } = true;

        public bool EmailConfirmed { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public DateTime? UpdatedAt { get; private set; }

        public DateTime? LastLoginAt { get; private set; }

        public string? PasswordResetToken { get; private set; }
        public DateTime? PasswordResetTokenExpiresAt { get; private set; }

        protected User()
        {
        }

        public User(string email,string passwordHash,string fullName)
        {
            Id = Guid.NewGuid();
            Email = email;
            PasswordHash = passwordHash;
            FullName = fullName;
            Role = "User";
            IsActive = true;
            EmailConfirmed = false;
            CreatedAt = DateTime.UtcNow;
        }
        public static User Create(string email,string passwordHash,string fullName,string role)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                PasswordHash = passwordHash,
                FullName = fullName,
                Role = role,
                IsActive = true,
                EmailConfirmed = false,
                CreatedAt = DateTime.UtcNow
            };
        }
        public void Update(string fullName,string role)
        {
            FullName = fullName;
            Role = role;
        }


        public void SetPasswordResetToken(string token,DateTime expiresAt)
        {
            PasswordResetToken = token;
            PasswordResetTokenExpiresAt = expiresAt;
        }

        public bool IsPasswordResetTokenValid(string token)
        {
            return PasswordResetToken == token && PasswordResetTokenExpiresAt.HasValue
                && PasswordResetTokenExpiresAt.Value > DateTime.UtcNow;
        }

        public void ChangePassword(string passwordHash)
        {
            PasswordHash = passwordHash;
            PasswordResetToken = null;
            PasswordResetTokenExpiresAt = null;
        }
        public void Activate()
        {
            IsActive = true;
        }

        public void Deactivate()
        {
            IsActive = false;
        }
    }
}
