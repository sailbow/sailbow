using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sb.Data.Models
{
    [AttributeUsage(AttributeTargets.Class)]
    public class PersistenceModelAttribute : Attribute
    {
        public string Name { get; private set; }

        public PersistenceModelAttribute(string name)
        {
            Name = name;
        }
    }
}
