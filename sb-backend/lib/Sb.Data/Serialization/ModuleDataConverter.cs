namespace Sb.Data.Serialization;

using System;
using System.Collections.Generic;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Sb.Data.Models;

public class ModuleDataConverter : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return typeof(ModuleData).IsAssignableFrom(objectType);
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
        ModuleType moduleType = Enum.Parse<ModuleType>(jObj.Value<string>("type"), true);
        var data = moduleType switch
        {
            ModuleType.Date => new DateModuleData(),
            _ => throw new JsonSerializationException($"Module type '{moduleType}' is not supported")
        };
        serializer.Populate(jObj.CreateReader(), data);
        return data;
    }
}
