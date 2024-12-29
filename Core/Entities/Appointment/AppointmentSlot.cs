using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Core.Entities.Appointment
{
    public class AppointmentSlot : BaseEntity
    {
        
        
        public DateTime Startdate { get; set; } 
        
        //[JsonPropertyName("end")]
        public DateTime Enddate { get; set; }

       
        public Doctor Doctor { get; set; }

        public int DoctorId { get; set; }      
        

        public string Status { get; set; } = "free";

        public string Title { get; set; }

        //[NotMapped]
        //public int Resource { get { return Doctor.Id; } }

        //[NotMapped]
        //public string DoctorName { get { return Doctor.Name; } }
        
    }
}