using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TaskManagement.DAL.Models;

namespace TaskManagement.Web.Dto
{
    public class TodoDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime Deadline { get; set; }

        public int Order { get; set; }

        public int StateId { get; set; }
    }
}
