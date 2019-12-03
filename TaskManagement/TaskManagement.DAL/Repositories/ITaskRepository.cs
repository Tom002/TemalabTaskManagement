using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.DAL.Models;
using Task = System.Threading.Tasks.Task;

namespace TaskManagement.DAL.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<Todo>> ListTodos();
        Task<Todo> GetTodo(int taskId);
        void DeleteTodo(Todo task);
        Task CreateTodo(Todo task);
        bool IsEntryUpdated(Todo task);
        Task<bool> SaveAll();
        void OrderChange(int taskId, int oldOrder, int newOrder);

        Task<IEnumerable<State>> ListStates();
        Task<State> GetState(int stateId);
        Task DeleteState(State state);
        Task CreateState(State state);
        Task<int> GetStateCount();

    }
}
