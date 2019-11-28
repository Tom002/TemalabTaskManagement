using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManagement.Web.Dto
{
    public class StateDto
    {
        public int StateId { get; set; }
        public string Name { get; set; }
    }
}
