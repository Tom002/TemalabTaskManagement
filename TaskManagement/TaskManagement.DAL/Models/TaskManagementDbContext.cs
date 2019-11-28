using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace TaskManagement.DAL.Models
{
    public class TaskManagementDbContext : DbContext
    {
        public DbSet<State> States { get; set; }
        public DbSet<Todo> Todos { get; set; }

        public TaskManagementDbContext(DbContextOptions<TaskManagementDbContext> options)
            : base(options)
        {
        }

        public TaskManagementDbContext()
        { }
    }
}
