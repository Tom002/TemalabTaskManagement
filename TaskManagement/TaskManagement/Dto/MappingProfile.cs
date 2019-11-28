using AutoMapper;
using TaskManagement.DAL.Dto;
using TaskManagement.DAL.Models;

namespace TaskManagement.Web.Dto
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<TodoForUpdateDto, Todo>();
            CreateMap<TodoForCreationDto, Todo>();
            CreateMap<StateForCreationDto, State>();
            CreateMap<StateForUpdateDto, State>();
            CreateMap<Todo, TodoDto>();
            CreateMap<State, StateDto>();
        }
    }
}
