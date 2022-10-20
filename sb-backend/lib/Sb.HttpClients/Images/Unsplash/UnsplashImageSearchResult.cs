using System.Text.Json.Serialization;

namespace Sb.HttpClients.Images.Unsplash
{
    public class UnsplashImageSearchResult
    {
        [JsonPropertyName("total")]
        public int Total { get; set; }
        [JsonPropertyName("total_pages")]
        public int TotalPages { get; set; }
        [JsonPropertyName("results")]
        public IEnumerable<UnsplashImage> Results { get; set; } = Enumerable.Empty<UnsplashImage>();
    }

    public class UnsplashImage
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public UnsplashImageUrls? Urls { get; set; }

    }

    public class UnsplashImageUrls
    {
        public string? Regular { get; set; }
    }
}
