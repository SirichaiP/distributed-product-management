using AuthService.Application.Common.Exceptions;
using AuthService.Application.Exceptions;
using FluentValidation;
using System.Net;

namespace AuthService.API.Middlewares;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionMiddleware(
        RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DuplicateEmailException ex)
        {
            context.Response.StatusCode =
                (int)HttpStatusCode.Conflict;

            await context.Response.WriteAsJsonAsync(
                new
                {
                    message = ex.Message
                });
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode =
                (int)HttpStatusCode.BadRequest;

            await context.Response.WriteAsJsonAsync(
                new
                {
                    errors = ex.Errors.Select(x => new
                    {
                        x.PropertyName,
                        x.ErrorMessage
                    })
                });
        }
        catch (UnauthorizedException ex)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            await context.Response.WriteAsJsonAsync(new
            {
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;

            await context.Response.WriteAsJsonAsync(
                new
                {
                    message = ex.Message
                });
        }
    }
}