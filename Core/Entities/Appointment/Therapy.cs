using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Entities.AppointmentAgreegate
{
    public class Therapy : BaseEntity
    {
        public string Name { get; set; }


        public int TherapyCategoryId { get; set; }
        public TherapyCategory TherapyCategory { get; set; } = null!;
       
        // Navigation property for the many-to-many relationship
        [JsonIgnore]
        public IReadOnlyList<TherapistTherapy> TherapistTherapies { get; set; } = new List<TherapistTherapy>();

         // Using IReadOnlyList for the navigation property
        //public IReadOnlyList<Therapist> Therapists { get; }

        //public List<Therapist> Therapists { get; } = [];
        //public IReadOnlyList<Therapist> Therapists { get; } = new List<Therapist>(); // Collection navigation containing dependents

        //public IReadOnlyList<TherapistTherapy> TherapistTherapys { get; } = [];


    }
}