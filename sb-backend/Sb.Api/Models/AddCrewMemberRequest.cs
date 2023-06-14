using System;
using Sb.Data.Models;

namespace Sb.Api.Models
{
	public record AddCrewMemberRequest(Guid UserId, BoatRole Role);
}

