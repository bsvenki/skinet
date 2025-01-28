using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class AppointmentSpecParams
    {
        public int? PatientID {get; set;}
        public int? BookingTypeId {get; set;}
        public int? TherapyCategoryId {get; set;}

        public int? TherapistTherapyId {get; set;}

        //public int? TherapistId {get; set;}
        public int? DoctorId {get; set;}

        public string? Status {get; set;} 

    }
}