using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sb.OAuth2
{
    public abstract class AuthorizedUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public abstract string GetProfilePicture();
    }
}
