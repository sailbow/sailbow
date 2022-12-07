namespace Sb.Data.Serialization;

using System;
using System.Collections.Generic;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Sb.Data.Models;

public class ModuleWithDataJsonConverter : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return typeof(ModuleWithData).IsAssignableFrom(objectType);
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
        Enum.TryParse(jObj.Value<string>("type"), true, out ModuleType moduleType);
        ModuleWithData module = new();
        module.Data = moduleType switch
        {
            ModuleType.Date => new List<DateModuleData>(),
            ModuleType.Location => new List<LocationModuleData>(),
            _ => throw new JsonSerializationException($"Module type '{moduleType}' is not supported")
        };
        serializer.Populate(jObj.CreateReader(), module);
        if (module.Settings.AnonymousVoting)
        {
            foreach (ModuleData md in module.Data)
            {
                md.Votes = new HashSet<string>();
            }
        }
        return module;
    }
}
