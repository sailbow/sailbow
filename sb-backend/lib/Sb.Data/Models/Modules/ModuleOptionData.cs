using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Sb.Data.Models
{
    [JsonPolymorphic(
        TypeDiscriminatorPropertyName = "type",
        UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FailSerialization)]
    [JsonDerivedType(typeof(DateModuleOption))]
    public abstract class ModuleOptionData { }

    public class DateModuleOption : ModuleOptionData
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
