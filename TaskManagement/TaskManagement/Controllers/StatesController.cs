using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.DAL.Models;
using TaskManagement.DAL.Repositories;
using TaskManagement.Web.Dto;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatesController : ControllerBase
    {
        private readonly ITaskRepository _repo;
        private readonly IMapper _mapper;

        public StatesController(ITaskRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetStates()
        {
            var states = await _repo.ListStates();
            var statesToReturn = _mapper.Map<IEnumerable<State>, ICollection<StateDto>>(states);
            return Ok(statesToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetState(int id)
        {
            var state = await _repo.GetState(id);
            if (state == null)
            {
                return NotFound("State with given id was not found");
            }
            var stateToReturn = _mapper.Map<State, StateDto>(state);
            return Ok(stateToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateState([FromBody] StateForCreationDto stateForCreation)
        {
            var state = _mapper.Map<StateForCreationDto, State>(stateForCreation);
            await _repo.CreateState(state);

            if (await _repo.SaveAll())
            {
                var stateToReturn = _mapper.Map<State, StateDto>(state);
                return CreatedAtAction(nameof(GetState), new {id = stateToReturn.StateId}, stateToReturn);
            }
            return BadRequest("Creating state failed on save");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteState(int id)
        {
            var state = await _repo.GetState(id);
            if (state == null)
            {
                return NotFound($"State with id:{id} not found");
            }
            _repo.DeleteState(state);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest($"Deleting state with id:{id} failed on save");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateState(int id, StateForUpdateDto stateForUpdate)
        {
            var state = await _repo.GetState(id);
            if (state == null)
            {
                return NotFound($"State with id:{id} not found");
            }

            _mapper.Map(stateForUpdate, state);
            if (await _repo.SaveAll())
            {
                return NoContent();
            }
            return BadRequest($"Updating state with id:{id} failed on save");
        }
    }
}
