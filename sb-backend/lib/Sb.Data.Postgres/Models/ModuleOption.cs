using System;
using System.Collections.Generic;

namespace Sb.Data.Postgres;

public partial class ModuleOption
{
    public Guid Id { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public Guid? ModuleId { get; set; }

    public string Data { get; set; }

    public virtual Profile CreatedByNavigation { get; set; }

    public virtual Module Module { get; set; }
}
