﻿using System;
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
            return await _context.Todos.AsNoTracking().ToListAsync();
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

        public bool IsEntryUpdated(Todo task)
        {
            var taskEntry = _context.ChangeTracker.Entries<Todo>().FirstOrDefault(e => e.Entity.Id == task.Id);
            if (taskEntry!= null && taskEntry.State == EntityState.Modified)
            {
                return true;
            }
            return false;
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
            return await _context.States.AsNoTracking().ToListAsync();
        }

        public async Task<State> GetState(int stateId)
        {
            return await _context.States.FirstOrDefaultAsync(s => s.StateId == stateId);
        }

        public async Task DeleteState(State state)
        {
            var todosWithState = await _context.Todos.Where(t => t.StateId == state.StateId).ToListAsync();
            foreach (var todo in todosWithState)
            {
                DeleteTodo(todo);
            }
            _context.States.Remove(state);
        }

        public async Task CreateState(State state)
        {
            await _context.States.AddAsync(state);
        }

        public Task<int> GetStateCount()
        {
            return _context.States.CountAsync();
        }
    }
}
