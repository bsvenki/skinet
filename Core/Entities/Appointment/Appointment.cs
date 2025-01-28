using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Core.Entities.AppointmentAgreegate
{
    public class Appointment : BaseEntity
    {
        public int PatientId { get; set; }
        public int BookingTypeId  { get; set; }
        public int TherapyCategoryId { get; set; } 
        public int TherapistTherapyId { get; set; }
        public int DoctorId { get; set; }
        public DateTime Startdate { get; set; } 
        
        //[JsonPropertyName("end")]
        public DateTime Enddate { get; set; }     
      

        public string Status { get; set; } = "free";

        public string Title { get; set; }

        //[NotMapped]
        //public int Resource { get { return Doctor.Id; } }

        //[NotMapped]
        //public string DoctorName { get { return Doctor.Name; } }
        
    }
}