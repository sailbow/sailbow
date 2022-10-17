using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Models;
public class PaginatedRequest
{
    [FromQuery] public int Page { get; set; } = 1;
    [FromQuery] public int PerPage { get; set; } = 10;
}

public enum SortType
{
    Ascending,
    Descending
}

public class GetBoatsRequest : PaginatedRequest
{
    //[FromQuery] public bool? Completed { get; set; }
    [FromQuery] public string Search { get; set; } = string.Empty;
    //[FromQuery] public Dictionary<string, SortType> Sorts { get; set; } = new Dictionary<string, SortType>();
}
