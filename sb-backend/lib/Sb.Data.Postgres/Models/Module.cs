using System;
using System.Collections.Generic;

namespace Sb.Data.Postgres;

public partial class Module
{
    public Guid Id { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public string Type { get; set; }

    public bool AllowMultiVote { get; set; }

    public bool? AnonymousVoting { get; set; }

    public DateTimeOffset? VotingDeadline { get; set; }

    public Guid? BoatId { get; set; }

    public virtual Boat Boat { get; set; }

    public virtual Profile CreatedByNavigation { get; set; }

    public virtual ICollection<ModuleOption> ModuleOptions { get; set; } = new List<ModuleOption>();
}
