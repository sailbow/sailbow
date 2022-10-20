using System;

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
