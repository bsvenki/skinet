using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities.AppointmentAgreegate
{
    public class TherapistTherapy : BaseEntity
    {
        public int TherapyId { get; set; }
        public Therapy Therapy { get; set; }    
        public int TherapistId { get; set; }
        public Therapist Therapist { get; set; } 
        //public Therapy Therapy { get; set; } = null!;
        //public Therapist Therapist { get; set; } = null!;

       
        

        

        //[NotMapped]
        //public IReadOnlyList<Therapist> Therapists { get; } = new List<Therapist>(); // Collection navigation containing dependents
        

         
    }
}