namespace AuthService.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; private set; } = Guid.NewGuid();

        public Guid UserId { get; private set; }

        public string Token { get; private set; } = default!;

        public DateTime ExpiresAt { get; private set; }

        public bool IsRevoked { get; private set; }

        public DateTime? Revoked { get; private set; }


        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        public User User { get; private set; } = default!;

        private RefreshToken() { }

        public RefreshToken(Guid userId, string token, DateTime expiresAt)
        {
            UserId = userId;
            Token = token;
            ExpiresAt = expiresAt;
            IsRevoked = false;
        }

        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

        public bool IsActive => !IsRevoked && !IsExpired;

        public void Revoke()
        {
            IsRevoked = true;
            Revoked = DateTime.UtcNow;

        }
      
    }
}