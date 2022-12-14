namespace Sb.Data.Serialization;

using System;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Sb.Data.Models;

public class ModuleDataJsonConverter : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return typeof(ModuleData).IsAssignableFrom(objectType);
    }

    public override bool CanWrite
    {
        get { return false; }
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        var jObj = JObject.Load(reader);
        string typeStr = jObj.Value<string>("type");
        Enum.TryParse(typeStr, ignoreCase: true, out ModuleType moduleType);
        ModuleData md = moduleType switch
        {
            ModuleType.Date => new DateModuleData(),
            ModuleType.Location => new LocationModuleData(),
            _ => throw new JsonSerializationException($"Module type '{typeStr}' is not supported")
        };
        serializer.Populate(jObj.CreateReader(), md);
        return md;
    }

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }
}
