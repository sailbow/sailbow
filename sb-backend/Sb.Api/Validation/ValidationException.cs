namespace Sb.Api.Validation
{
    internal class ValidationException : Exception
    {
        public ValidationException() : base() { }
        public ValidationException(string message) : base(message) { }
    }

    internal class MissingEntityException : ValidationException
    {
        public MissingEntityException(string message) : base(message) { }
    }

    internal class UnauthorizedException : ValidationException { }

    internal class ForbiddenResourceException : ValidationException { }

    internal class ConflictException: ValidationException { }
}
