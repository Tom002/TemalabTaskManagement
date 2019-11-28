﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManagement.Web.Dto
{
    public class StateForUpdateDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
    }
}
