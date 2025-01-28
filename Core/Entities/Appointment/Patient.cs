using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.AppointmentAgreegate
{
    public class Patient: BaseEntity
    {
        public string Name { get; set; }

        public string Email { get; set; }
    }
}