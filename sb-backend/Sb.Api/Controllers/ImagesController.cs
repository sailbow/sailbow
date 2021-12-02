using Sb.HttpClients.Images;

using Sb.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Sb.Api.Controllers;
public class ImagesController : ApiControllerBase
{
    private readonly IImageClient _imageClient;

    public ImagesController(
        IImageClient imageClient)
    {
        _imageClient = imageClient;
    }

    [HttpGet("search")]
    public async Task<IEnumerable<Image>> ImageSearch(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int perPage = 10)
    {
        return await _imageClient.SearchImagesAsync(query, page, perPage);
    }
}
