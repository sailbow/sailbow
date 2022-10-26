namespace Sb.Api.Serialization;

using System;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Sb.Data.Models;

public class ModuleConverter : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return typeof(Module).IsAssignableFrom(objectType);
    }

    public override bool CanWrite
    {
        get { return false; }
    }

    public override void WriteJson(JsonWriter writer,
    object value, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        var jObj = JObject.Load(reader);
        if (!Enum.TryParse(jObj.Value<string>("moduleType"), out ModuleType moduleType))
        {
            throw new JsonException("Invalid moduleType");
        }
        Module module = new();
        module.Data = moduleType switch
        {
            ModuleType.Date => new List<DateModuleData>(),
            _ => throw new NotSupportedException($"{moduleType} is not yet supported")
        };
        serializer.Populate(jObj.CreateReader(), module);
        return module;
    }
}
