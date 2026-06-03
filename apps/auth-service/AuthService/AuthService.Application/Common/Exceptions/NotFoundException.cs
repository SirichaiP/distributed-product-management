namespace AuthService.Application.Common.Exceptions;

public sealed class NotFoundException : Exception
{
    public NotFoundException(string name)
        : base($"{name} was not found.")
    {
    }

    public NotFoundException(string name, object key)
        : base($"{name} ({key}) was not found.")
    {
    }
}