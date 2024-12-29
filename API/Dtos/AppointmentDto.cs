using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Core.Entities.Appointment;

namespace API.Dtos
{
    public class AppointmentDto
    {

        public int id {get; set;}
        public string Title { get; set; }

        //[DataType(DataType.Date)]
        //[JsonPropertyName("start")]
        public DateTime? start { get; set; }

        //[DataType(DataType.Date)]
        //[JsonPropertyName("end")]
        public DateTime? end { get; set; } 

        public int doctorId { get; set; } = 1;

        
    }
}