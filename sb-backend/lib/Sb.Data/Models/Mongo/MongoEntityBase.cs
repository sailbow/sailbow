using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MongoDB.Bson;

namespace Sb.Data.Models.Mongo
{
    public class MongoEntityBase : EntityBase
    {
        public MongoEntityBase()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }
    }
}
