using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Core.Entities.AppointmentAgreegate;

namespace API.Dtos
{
    public class AppointmentDto
    {

        public int Id {get; set;}

        public int PatientId { get; set; }
        public int BookingTypeId { get; set; }
        public int TherapyCategoryId { get; set; }
        public int TherapistTherapyId { get; set; }
        public int DoctorId { get; set; }

        //[DataType(DataType.Date)]
        //[JsonPropertyName("start")]
        public DateTime? Start { get; set; }

        //[DataType(DataType.Date)]
        //[JsonPropertyName("end")]
        public DateTime? End { get; set; } 

         public string Status { get; set; }

        public string Title { get; set; }

        

        

        

        



       


    }
}