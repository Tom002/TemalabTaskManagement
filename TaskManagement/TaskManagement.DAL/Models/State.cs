using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TaskManagement.DAL.Models
{
    public class State
    {
        [Required]
        public int StateId { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        public ICollection<Todo> Todos { get; set; }
    }
}
