
namespace Sb.OAuth2
{
    public class GoogleUserInfo : AuthorizedUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Picture { get; set; }

        public override string GetProfilePicture() => Picture;
    }
}
