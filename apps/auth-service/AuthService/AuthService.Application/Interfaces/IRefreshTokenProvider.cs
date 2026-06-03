using System;
using System.Collections.Generic;
using System.Text;

namespace AuthService.Application.Interfaces
{
    public interface IRefreshTokenProvider
    {
        string GenerateRefreshToken();
    }
}
