using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Models;
public class PaginatedRequest
{
    [FromQuery] public int Page { get; set; } = 1;
    [FromQuery] public int PerPage { get; set; } = 10;
}