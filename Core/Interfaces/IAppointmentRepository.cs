using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Appointment;

namespace Core.Interfaces
{
    public interface IAppointmentRepository
    {
       

        Task<AppointmentSlot> GetAppointmentByIdAsync(int id);
        Task<IReadOnlyList<AppointmentSlot>> GetAppointmentsAsync();
    }
}