using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using TaskManagement.DAL.Models;

namespace TaskManagement.DAL.Dto
{
    public class TodoForCreationDto
    {
        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        [Required]
        public int StateId { get; set; }
    }
}
