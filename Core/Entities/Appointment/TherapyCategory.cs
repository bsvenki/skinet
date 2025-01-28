using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.AppointmentAgreegate
{
    public class TherapyCategory : BaseEntity
    {
        public string Name { get; set; }

        public IReadOnlyList<Therapy> Therapys { get; } = new List<Therapy>(); // Collection navigation containing dependents
        
    }
}