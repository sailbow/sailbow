using Sb.Data.Models.Mongo;

namespace Sb.Api.Models
{
    public class CrewMemberWithUserInfo : CrewMember
    {
        public string Email { get; set; }
        public string Name { get; set; }
    }
}
