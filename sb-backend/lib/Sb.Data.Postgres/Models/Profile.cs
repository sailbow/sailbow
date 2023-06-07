using System;
using System.Collections.Generic;

namespace Sb.Data.Postgres;

public partial class Profile
{
    public DateTime? CreatedAt { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public Guid UserId { get; set; }

    public virtual ICollection<Boat> Boats { get; set; } = new List<Boat>();

    public virtual ICollection<CrewMember> CrewMembers { get; set; } = new List<CrewMember>();

    public virtual ICollection<ModuleOption> ModuleOptions { get; set; } = new List<ModuleOption>();

    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();

    public virtual User User { get; set; }
}
