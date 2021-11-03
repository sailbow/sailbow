namespace Sb.OAuth2
{
    public class AuthorizedUser
    {
        public virtual string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
        public virtual string GetProfilePicture() => Picture;
    }
}
