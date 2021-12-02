using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Models;

public class ImageSearchRequest : PaginatedRequest
{
    [FromQuery] public string Query { get; set; }
}