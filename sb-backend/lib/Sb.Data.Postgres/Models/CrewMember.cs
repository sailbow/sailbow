using System;
using System.Collections.Generic;

namespace Sb.Data.Postgres;

public partial class CrewMember
{
    public Guid UserId { get; set; }

    public Guid BoatId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Boat Boat { get; set; }

    public virtual Profile User { get; set; }
}
