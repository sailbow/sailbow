namespace Sb.Data.Models
{
    public abstract class EntityBase
    {
        public virtual string Id { get; set; }
        
        protected EntityBase() { }

        public virtual string GetEntityName() => GetType().Name;
    }
}
