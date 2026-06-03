using AuthService.Infrastructure.JWT;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AuthService.Application.Interfaces;
using AuthService.Persistence.Repositories;
using AuthService.Infrastructure.Security;



namespace AuthService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services,IConfiguration configuration)
    {
        // JWT Settings

        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

        // JWT Provider

        services.AddScoped<IJwtProvider,JwtProvider>();

        // Password Hasher

        services.AddScoped<IPasswordHasher,PasswordHasher>();

        // Repository
        services.AddScoped<IRefreshTokenProvider, RefreshTokenProvider>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IUserRepository,UserRepository>();
        return services;
    }
}