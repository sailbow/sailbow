namespace Sb.Data.Models
{
    public class Banner
    {
        public bool Show { get; set; } = false;
        public BannerType Type { get; set; }
        public string Value { get; set; }
        public int? Position { get; set; } = 0;
    }
}
