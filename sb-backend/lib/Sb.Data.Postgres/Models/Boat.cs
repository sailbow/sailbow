using System;
using System.Collections.Generic;

namespace Sb.Data.Postgres;

public partial class Boat
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid CaptainUserId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string BannerUrl { get; set; }

    public string BannerColor { get; set; }

    public virtual Profile CaptainUser { get; set; }

    public virtual ICollection<CrewMember> CrewMembers { get; set; } = new List<CrewMember>();

    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();
}
