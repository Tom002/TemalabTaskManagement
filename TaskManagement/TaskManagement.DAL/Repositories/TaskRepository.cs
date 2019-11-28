using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagement.DAL.Models;
using Task = System.Threading.Tasks.Task;

namespace TaskManagement.DAL.Repositories
{
    public class TaskRepository: ITaskRepository
    {
        private readonly TaskManagementDbContext _context;

        public TaskRepository(TaskManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Todo>> ListTodos()
        {
            return await _context.Todos.ToListAsync();
        }

        public async Task<Todo> GetTodo(int taskId)
        {
            return await _context.Todos.FirstOrDefaultAsync(t => t.Id == taskId);
        }

        public void DeleteTodo(Todo task)
        {
            _context.Todos.Remove(task);

            var tasksAfterDeleted = _context.Todos.Where(t => t.Order > task.Order);
            foreach (var t in tasksAfterDeleted)
            {
                t.Order--;
            }
        }

        public async Task CreateTodo(Todo task)
        {
            var nextOrder = await _context.Todos.Select(t => t.Order).DefaultIfEmpty(0).MaxAsync() + 1;
            task.Order = nextOrder;

            await _context.Todos.AddAsync(task);
        }

        public void OrderChange(int taskId, int oldOrder, int newOrder)
        {
            if (oldOrder > newOrder)
            {
                var todos = _context.Todos.Where(t => t.Order >= newOrder && t.Order < oldOrder && t.Id != taskId);
                foreach (var todo in todos)
                {
                    todo.Order++;
                }
            }
            else if (newOrder > oldOrder)
            {
                var todos = _context.Todos.Where(t => t.Order <= newOrder && t.Order > oldOrder && t.Id != taskId);
                foreach (var todo in todos)
                {
                    todo.Order--;
                }
            }
        }


        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<State>> ListStates()
        {
            return await _context.States.ToListAsync();
        }

        public async Task<State> GetState(int stateId)
        {
            return await _context.States.FirstOrDefaultAsync(s => s.StateId == stateId);
        }

        public void DeleteState(State state)
        {
            _context.States.Remove(state);
        }

        public async Task CreateState(State state)
        {
            await _context.States.AddAsync(state);
        }
    }
}
