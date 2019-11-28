using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TaskManagement.DAL.Models
{
    public class Todo
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        public int StateId { get; set; }

        [Required]
        public State State { get; set; }
    }
}
