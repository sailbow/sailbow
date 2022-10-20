using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Models;

public class GetBoatsRequest : PaginatedRequest
{
    private string _search;

    [FromQuery]
    public string Search
    {
        get => _search ?? string.Empty;
        set => _search = value;
    }
}
