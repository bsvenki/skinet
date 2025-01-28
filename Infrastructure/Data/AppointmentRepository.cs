using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.AppointmentAgreegate;
using Core.Interfaces;
using Infrastructue.Data;
using Infrastructure.Data;
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


        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
                // return await _context.Products.FindAsync(id);

                return await _context.Appointments
                //.Include(p => p.TherapistTherapy)                
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IReadOnlyList<Appointment>> GetAppointmentsAsync()
        {
             return await _context.Appointments.ToListAsync();
        }



        public async Task<Patient> GetPatientByIdAsync(int id)
        {
                // return await _context.Products.FindAsync(id);

                return await _context.Patients
                //.Include(p => p.Patients)                
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IReadOnlyList<Patient>> GetPatientsAsync()
        {
             return await _context.Patients.ToListAsync();
        }

        public async Task<IReadOnlyList<TherapyCategory>> GetTherapyCategoriesAsync()
        {
            return  await _context.TherapyCategories.ToListAsync();

        }

        public async Task<IReadOnlyList<Therapy>> GetTherapysByCategoryIdAsync(int categoryid)
        {
          // return  await _context.Therapys.Where(p => p.TherapyCategoryId == categoryid).Include(x => x.Therapists).Where(x => x.TherapyCategoryId == categoryid).ToListAsync();
          return  await _context.Therapies.Where(p => p.TherapyCategoryId == categoryid).ToListAsync();
        }

        public async Task<IReadOnlyList<TherapistTherapy>> GetTherapistsByTherapyIdAsync()
        {
           //return  await _context.TherapistTherapys.Where(p => p.TherapyId == therapyid).ToListAsync();

           return await _context.TherapistTherapies
          .Include(p => p.Therapy)          
          .ToListAsync();
        }

        





        
    }
}