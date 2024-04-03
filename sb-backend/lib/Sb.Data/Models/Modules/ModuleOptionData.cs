using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.VisualBasic.FileIO;

namespace Sb.Data.Models
{
    public enum ModuleType
    {
        Date,
        Location
    }

    [JsonPolymorphic(
        TypeDiscriminatorPropertyName = "type",
        UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FailSerialization)]
    [JsonDerivedType(typeof(DateModuleOptionData), typeDiscriminator: "date")]
    public class ModuleOptionData
    {
    }

    public class DateModuleOptionData : ModuleOptionData
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TimeSpan StartTime => new TimeSpan(StartDate.Hour, StartDate.Minute, 0);
        public TimeSpan? EndTime => EndDate is null ? null : new TimeSpan(EndDate.Value.Hour, EndDate.Value.Minute, 0);
    }
}
