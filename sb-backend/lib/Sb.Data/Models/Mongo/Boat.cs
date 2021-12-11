using System;
using System.Collections.Generic;
using System.Linq;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Sb.Data.Models.Mongo
{
    [MongoCollection("Boats")]
    [BsonIgnoreExtraElements]
    public class Boat : MongoEntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Banner Banner { get; set; }
        public Code Code { get; set; }
        [BsonIgnore]
        public bool Show { get; set; } = false;
        public IEnumerable<CrewMember> Crew { get; set; } = Enumerable.Empty<CrewMember>();
    }

    public class CrewMember
    {
        public string UserId { get; set; }
        [BsonRepresentation(BsonType.String)]
        public Role Role { get; set; }
        public string Info { get; set; }
        public string Email { get; set; }
    }

    public enum Role
    {
        Captain,
        Assistant,
        Sailor
    }
    public enum BannerType
    {
        Color,
        Link
    }
    public class Banner
    {
        public bool Show { get; set; } = false;
        public BannerType Type { get; set; }
        public string Value { get; set; }
        public int Position { get; set; } = 0;
    }
    public class Photo
    {
        public string Src { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Photographer { get; set; }
        public string PhotographerUrl { get; set; }
    }
    public class Code
    {
        public string Value { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
