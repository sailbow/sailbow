namespace Sb.Data.Models;

using System.Collections.Generic;
using System.Linq;

public class ModuleWithData
{
    public string Id { get; set; }
    public string BoatId { get; set; }
    public string Name { get; set; }
    public ModuleType Type { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
    public int Order { get; set; }
    public string FinalizedOptionId { get; set; }
    public ModuleSettings Settings { get; set; }
    public IEnumerable<ModuleData> Data { get; set; } = Enumerable.Empty<ModuleData>();
}