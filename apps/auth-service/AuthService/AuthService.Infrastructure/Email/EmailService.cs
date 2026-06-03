using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace AuthService.Infrastructure.Email;

public sealed class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendAsync(
        string to,
        string subject,
        string body)
    {
        var host = _configuration["Smtp:Host"];
        var port = int.Parse(_configuration["Smtp:Port"]!);
        var username = _configuration["Smtp:Username"];
        var password = _configuration["Smtp:Password"];
        var from = _configuration["Smtp:From"];

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(username, password)
        };

        using var message = new MailMessage(
            from!,
            to,
            subject,
            body);

        await client.SendMailAsync(message);
    }
}