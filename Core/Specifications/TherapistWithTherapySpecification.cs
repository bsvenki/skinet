using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Core.Entities.AppointmentAgreegate;
using Microsoft.EntityFrameworkCore.Query.Internal;
namespace Core.Specifications
{
    public class TherapistWithTherapySpecification: BaseSpecification<TherapistTherapy>
    {
        public TherapistWithTherapySpecification(int TherapyId)
            :base(x => x.TherapyId == TherapyId
                
                //(!appointmentParams.TherapyId.HasValue || x.TherapyId == appointmentParams.TherapyId) 
                
            )
        {
            
            AddInclude(x => x.Therapist); 
           // AddInclude(x => x.Therapy );           
           //AddInclude(x => x.TherapistTherapies);
           

        }
        
    }
}