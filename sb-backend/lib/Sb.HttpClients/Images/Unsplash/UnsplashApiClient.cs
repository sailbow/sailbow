using System.Net.Http.Json;

namespace Sb.HttpClients.Images.Unsplash;
public class UnsplashApiClient : IImageClient
{
    private readonly HttpClient _httpClient;
    private readonly UnsplashApiConfiguration _config;
    public UnsplashApiClient(UnsplashApiConfiguration config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _httpClient = new HttpClient()
        {
            BaseAddress = new Uri("https://api.unsplash.com"),
            Timeout = TimeSpan.FromSeconds(10)
        };
    }

    public async Task<IEnumerable<Image>> SearchImagesAsync(string query, int page, int perPage = 10)
    {
        string uri = $"search/photos?query={query}" +
                $"&client_id={_config.ClientId}" +
                $"&page={page}" +
                $"&perPage={perPage}" +
                $"&orientation={Orientation.Landscape.ToString().ToLower()}";
        var result = await _httpClient.GetFromJsonAsync<UnsplashImageSearchResult>(uri);

        return result?.Results.Select(result => new Image
        {
            Url = result?.Urls?.Regular,
            Width = result!.Width,
            Height = result!.Height
        }) ?? Enumerable.Empty<Image>();
    }
}
