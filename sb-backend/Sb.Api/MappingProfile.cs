using AutoMapper;

using Sb.Api.Models;
using Sb.Data.Models;

namespace Sb.Api
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Boat, BoatDto>();
            CreateMap<Module, LightWeightModule>();
        }
    }
}
