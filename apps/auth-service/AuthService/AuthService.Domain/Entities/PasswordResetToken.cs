
namespace AuthService.Domain.Entities
{
    public class PasswordResetToken
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public string Token { get; private set; } = default!;
        public DateTime ExpiresAt { get; private set; }
        public bool IsUsed { get; private set; }

        private PasswordResetToken() { }

        public static PasswordResetToken Create(Guid userId, string token)
        {
            return new PasswordResetToken
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30),
                IsUsed = false
            };
        }

        public void MarkAsUsed()
        {
            IsUsed = true;
        }

        public bool IsExpired()
        {
            return DateTime.UtcNow > ExpiresAt;
        }
    }
}
