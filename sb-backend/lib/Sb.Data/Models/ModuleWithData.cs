namespace Sb.Data.Models;

using System;
using System.Collections.Generic;
using System.Linq;

public class ModuleWithData
{
    public Guid Id { get; set; }
    public Guid BoatId { get; set; }
    public string Name { get; set; }
    public ModuleType Type { get; set; }
    public Guid? AuthorId { get; set; }
    public string Description { get; set; }
    public int Order { get; set; }
    public string FinalizedOptionId { get; set; }
    public ModuleSettings Settings { get; set; }
    public IEnumerable<ModuleOption> Options { get; set; } = Enumerable.Empty<ModuleOption>();
}