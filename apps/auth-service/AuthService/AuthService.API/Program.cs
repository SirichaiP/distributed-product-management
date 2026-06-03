using AuthService.API.Middlewares;
using AuthService.Application.Common.Behaviors;
using AuthService.Application.Features.Auth.Commands.Register;
using AuthService.Application.Interfaces;
using AuthService.Infrastructure;
using AuthService.Infrastructure.Email;
using AuthService.Infrastructure.JWT;
using AuthService.Persistence.DbContexts;
using AuthService.Persistence.Repositories;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AuthDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddValidatorsFromAssembly(
    typeof(RegisterCommandValidator).Assembly);


builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(
        typeof(RegisterCommand).Assembly);
});

builder.Services.AddTransient(
    typeof(IPipelineBehavior<,>),
    typeof(ValidationBehavior<,>));

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

var jwtSettings =
    builder.Configuration
           .GetSection("JwtSettings")
           .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JwtSettings not configured");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.SecretKey))
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddValidatorsFromAssembly( typeof(RegisterCommandValidator).Assembly);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.UseAuthentication();

app.UseAuthorization();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.MapControllers();
app.MapGet("/", () => "AuthService API is running");
app.Run();