using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(string to,string subject,string body);
    }
}
