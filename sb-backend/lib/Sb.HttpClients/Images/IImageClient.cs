namespace Sb.HttpClients.Images;
public interface IImageClient
{
    public Task<IEnumerable<Image>> SearchImagesAsync(string query, int page, int perPage = 10);
}