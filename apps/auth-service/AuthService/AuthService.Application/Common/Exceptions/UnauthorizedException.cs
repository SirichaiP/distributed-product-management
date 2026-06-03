using System;
using System.Collections.Generic;
using System.Text;


    namespace AuthService.Application.Common.Exceptions;

public sealed class UnauthorizedException : Exception
{
    public UnauthorizedException(string message)
        : base(message)
    {
    }
}
    
