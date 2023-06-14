using System;
namespace Sb.Api.Models
{
	public class CreateBoatRequest
	{
		public string Name { get; set; }
		public string Description { get; set; }
        public string BannerColor { get; set; }
        public Uri BannerUrl { get; set; }
    }
}

