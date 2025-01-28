using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Entities.AppointmentAgreegate
{
    public class Therapist: BaseEntity
    {
        
        public string Name { get; set; }

        // Navigation property for the many-to-many relationship
        [JsonIgnore]
        public IReadOnlyList<TherapistTherapy> TherapistTherapies { get; set; } = new List<TherapistTherapy>();
         // Using IReadOnlyList for the navigation property
        //public IReadOnlyList<Therapy> Therapis { get; }
        
        //public IReadOnlyList<Therapy> Therapis { get; } = [];

        //public IReadOnlyList<TherapistTherapy> TherapistTherapys { get; } = [];
    }
}