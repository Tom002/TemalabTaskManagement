
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.DAL.Dto;
using TaskManagement.DAL.Repositories;
using TaskManagement.Web.Dto;
using Todo = TaskManagement.DAL.Models.Todo;

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly ITaskRepository _repo;
        private readonly IMapper _mapper;

        public TodosController(ITaskRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET api/values
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetTasks()
        {
            var todos = await _repo.ListTodos();
            var todosToReturn = _mapper.Map<IEnumerable<Todo>, IEnumerable<TodoDto>>(todos);
            return Ok(todosToReturn);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(int id)
        {
            var todo = await _repo.GetTodo(id);
            if (todo == null)
            {
                return NotFound("Task with given id not found");
            }
            var todoToReturn = _mapper.Map<Todo, TodoDto>(todo);
            return Ok(todoToReturn);
        }

        // POST api/values
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateTodo([FromBody] TodoForCreationDto taskForCreation)
        {
            var todo = _mapper.Map<TodoForCreationDto, Todo>(taskForCreation);
            await _repo.CreateTodo(todo);
            if (await _repo.SaveAll())
            {
                var todoToReturn = _mapper.Map<Todo, TodoDto>(todo);
                return CreatedAtAction(nameof(Get), new {id = todoToReturn.Id }, todoToReturn);
            }
            return BadRequest("Creating task failed on save");
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoForUpdateDto taskForUpdate)
        {
            var todo = await _repo.GetTodo(id);
            if (todo == null)
            {
                return NotFound("Task with given id not found");
            }
            int oldOrder = todo.Order;
            if (taskForUpdate.Order != oldOrder)
            {
                _repo.OrderChange(id,oldOrder,taskForUpdate.Order);
            }
            _mapper.Map(taskForUpdate, todo);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest($"Updating task with id:{id} failed on save");
        }

        // DELETE api/values/5
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todoToDelete = await _repo.GetTodo(id);
            if (todoToDelete == null)
            {
                return NotFound("Task with given id not found");
            }
            _repo.DeleteTodo(todoToDelete);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest($"Deleting task with id:{id} failed on save");

        }
    }
}
