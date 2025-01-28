using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.AppointmentAgreegate;

namespace Core.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<Patient> GetPatientByIdAsync(int id);
        Task<IReadOnlyList<Patient>> GetPatientsAsync();
       

        Task<Appointment> GetAppointmentByIdAsync(int id);
        Task<IReadOnlyList<Appointment>> GetAppointmentsAsync();

        Task<IReadOnlyList<TherapyCategory>>GetTherapyCategoriesAsync();


        Task<IReadOnlyList<Therapy>>GetTherapysByCategoryIdAsync(int categoryid);


       
    }
}