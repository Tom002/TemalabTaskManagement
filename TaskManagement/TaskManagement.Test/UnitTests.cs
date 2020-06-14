using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagement.DAL.Models;
using TaskManagement.DAL.Repositories;
using Xunit;

namespace TaskManagement.Test
{
    public class UnitTests
    {
        public TaskManagementDbContext GetDbContext()
        {
            var builder = new DbContextOptionsBuilder<TaskManagementDbContext>()
                .EnableSensitiveDataLogging()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());
            var context = new TaskManagementDbContext(builder.Options);

            return context;
        }

        public void SeedDatabase(TaskManagementDbContext context)
        {
            context.States.Add(new State { Name = "Created", StateId = 1 });
            context.States.Add(new State { Name = "In Progress", StateId = 2 });
            context.States.Add(new State { Name = "Ready", StateId = 3 });

            context.Todos.Add(
                new Todo
                {
                    Id = 1,
                    Title = "FirstTodoCreated",
                    Deadline = new DateTime(2019, 10, 30),
                    Description = "A regular todo",
                    Order = 1,
                    StateId = 1
                });

            context.Todos.Add(
                new Todo
                {
                    Id = 2,
                    Title = "SecondTodoInProgress",
                    Deadline = new DateTime(2019, 11, 10),
                    Description = "Another regular todo",
                    Order = 2,
                    StateId = 2
                });

            context.Todos.Add(
                new Todo
                {
                    Id = 3,
                    Title = "ThirdTodoInProgress",
                    Deadline = new DateTime(2019, 11, 13),
                    Description = "Another regular todo",
                    Order = 3,
                    StateId = 2
                });

            context.Todos.Add(
                new Todo
                {
                    Id = 4,
                    Title = "FourthTodoReady",
                    Deadline = new DateTime(2019, 11, 17),
                    Description = "Another regular todo",
                    Order = 4,
                    StateId = 3
                });
            context.SaveChanges();
        }

        [Fact]
        public async void GetExistingState()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);
                var stateFromRepo = await repo.GetState(1);

                Assert.Equal(1, stateFromRepo.StateId);
                Assert.Equal("Created", stateFromRepo.Name);
            }
        }

        [Fact]
        public async void GetNotExistingState()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);

                var repo = new TaskRepository(context);
                var stateFromRepo = await repo.GetState(11231412);

                Assert.Null(stateFromRepo);
            }
        }


        [Fact]
        public async void GetExistingTodo()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);
                var todoFromRepo = await repo.GetTodo(1);

                Assert.Equal(1, todoFromRepo.Id);
                Assert.Equal("FirstTodoCreated", todoFromRepo.Title);
            }   
        }

        [Fact]
        public async void GetNotExistingTodo()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);

                var repo = new TaskRepository(context);
                var todoFromRepo = await repo.GetTodo(11231412);

                Assert.Null(todoFromRepo);
            }
        }

        [Fact]
        public async void GetAllTodos()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);

                var todoList = await repo.ListTodos();

                Assert.Equal(4,todoList.Count());
            }
        }

        [Fact]
        public async void DeleteTodo()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);

                var firstTodo = await repo.GetTodo(1);
                Assert.NotNull(firstTodo);

                repo.DeleteTodo(firstTodo);
                await repo.SaveAll();

                var getTodoAfterDelete = await repo.GetTodo(1);
                Assert.Null(getTodoAfterDelete);

                var todoList = await repo.ListTodos();
                Assert.Equal(3, todoList.Count());
            }
        }

        [Fact]
        public async void DeleteState()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);

                var inProgressState = await repo.GetState(2);

                var todosInProgress = await context.Todos
                    .Where(t => t.StateId == inProgressState.StateId).ToListAsync();

                Assert.Equal(2,todosInProgress.Count);

                await repo.DeleteState(inProgressState);
                await repo.SaveAll();

                var stateAfterDelete = await repo.GetState(2);
                Assert.Null(stateAfterDelete);

                // Deleting a state should delete all todos in that specific state
                todosInProgress = await context.Todos
                    .Where(t => t.StateId == inProgressState.StateId).ToListAsync();
                Assert.Empty(todosInProgress);
            }
        }

        [Fact]
        public async void DeleteTodoOrderChange()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);

                var firstOrderBeforeDelete = context.Todos.FirstOrDefault(t => t.Order == 1);
                Assert.NotNull(firstOrderBeforeDelete);

                var secondOrderBeforeDelete = context.Todos.FirstOrDefault(t => t.Order == 2);
                Assert.NotNull(secondOrderBeforeDelete);

                repo.DeleteTodo(firstOrderBeforeDelete);
                await repo.SaveAll();

                // After deleting Task with order 1,
                // the previously second task should have its Order equal to 1
                var firstOrderAfterDelete = await context.Todos.FirstOrDefaultAsync(t => t.Order == 1);
                Assert.NotNull(firstOrderAfterDelete);
                Assert.Equal(secondOrderBeforeDelete.Id, firstOrderAfterDelete.Id);
                Assert.Equal("SecondTodoInProgress", firstOrderAfterDelete.Title);
            }
        }

        [Fact]
        public async void EditOrderChange()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);
                var orderThree = await context.Todos.FirstOrDefaultAsync(t => t.Order == 3);
                var orderTwo = await context.Todos.FirstOrDefaultAsync(t => t.Order == 2);
                var orderOne = await context.Todos.FirstOrDefaultAsync(t => t.Order == 1);

                orderThree.Order = 1;
                repo.OrderChange(orderThree.Id, 3, 1);
                await repo.SaveAll();

                // After moving task with order 3 to order 1,
                // the previously order 1 and 2 tasks should become 2 and 3
                // the task with order 4 should not change

                var newOrderOne = await context.Todos.FirstOrDefaultAsync(t => t.Order == 1);
                Assert.Equal(orderThree.Id, newOrderOne.Id);

                var newOrderTwo = await context.Todos.FirstOrDefaultAsync(t => t.Order == 2);
                Assert.Equal(orderOne.Id, newOrderTwo.Id);

                var newOrderThree = await context.Todos.FirstOrDefaultAsync(t => t.Order == 3);
                Assert.Equal(orderTwo.Id, newOrderThree.Id);

            }
        }

        [Fact]
        public async void CreateTodo()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);
                await repo.CreateTodo(new Todo
                {
                    Id = 5,
                    Title = "CreatedTodo",
                    Deadline = new DateTime(2019, 11, 30),
                    StateId = 1,
                    Description = "Todo created by test",
                });
                await repo.SaveAll();

                var inserted = await repo.GetTodo(5);

                Assert.NotNull(inserted);
                Assert.Equal(5, inserted.Order);
                Assert.Equal("Todo created by test", inserted.Description);
                Assert.Equal("CreatedTodo", inserted.Title);
                Assert.Equal(1, inserted.StateId);
            }
        }

        [Fact]
        public async void CreateState()
        {
            using (var context = GetDbContext())
            {
                SeedDatabase(context);
                var repo = new TaskRepository(context);
                await repo.CreateState(new State()
                {
                    Name = "StateCreated",
                    StateId = 4
                });
                await repo.SaveAll();

                var inserted = await repo.GetState(4);
                Assert.Equal("StateCreated", inserted.Name);
            }
        }
    }
}
