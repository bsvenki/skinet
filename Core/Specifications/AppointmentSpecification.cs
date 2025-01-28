using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.AppointmentAgreegate;

namespace Core.Specifications
{
    public class AppointmentSpecification : BaseSpecification<Appointment>
    {

        public AppointmentSpecification(AppointmentSpecParams appointmentParams)
            :base(x =>
                
                //(x.PatientId == appointmentParams.PatientID) &&
                (x.BookingTypeId == appointmentParams.BookingTypeId) &&
                (x.TherapyCategoryId == appointmentParams.TherapyCategoryId) &&
                (x.TherapistTherapyId == appointmentParams.TherapistTherapyId) &&
                (x.DoctorId == appointmentParams.DoctorId) &&
                (x.Status == appointmentParams.Status)
            )
        {
            //AddInclude(x => x.ProductType);
            //AddInclude(x => x.ProductBrand);
            //AddOrderBy(x => x.Name);
            //ApplyPaging(productParams.PageSize * (productParams.PageIndex - 1),productParams.PageSize);

            /*
            if(!string.IsNullOrEmpty(productParams.Sort))
            {
                switch(productParams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(n => n.Name);
                        break;
                }

            }
            */
        }
        
    }
}