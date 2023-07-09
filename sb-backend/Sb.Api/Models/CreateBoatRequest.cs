using System;
using Sb.Data.Models;

namespace Sb.Api.Models
{
	public class CreateBoatRequest
	{
		public string Name { get; set; }
		public string Description { get; set; }
        public BoatBanner Banner { get; set; }
    }
}

