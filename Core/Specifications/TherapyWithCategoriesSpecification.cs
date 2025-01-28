using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.AppointmentAgreegate;

namespace Core.Specifications
{
    public class TherapyWithCategoriesSpecification : BaseSpecification<Therapy>
    {

        public TherapyWithCategoriesSpecification(int categoryId) : base(o => o.TherapyCategoryId == categoryId)
        {
            //AddInclude(o => o.Therapists);
            //AddInclude(o => o.TherapistTherapys);
            //AddOrderByDescending(o => o.OrderDate);
        }
        
    }
}