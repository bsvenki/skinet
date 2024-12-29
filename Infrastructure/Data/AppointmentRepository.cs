using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Appointment;
using Core.Interfaces;
using Infrastructue.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly StoreContext _context;

         public AppointmentRepository(StoreContext context)
        {
            _context = context;
            
        }


        public async Task<AppointmentSlot> GetAppointmentByIdAsync(int id)
        {
                // return await _context.Products.FindAsync(id);

                return await _context.Appointments
                .Include(p => p.Doctor)                
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IReadOnlyList<AppointmentSlot>> GetAppointmentsAsync()
        {
             return await _context.Appointments.ToListAsync();
        }
    }
}