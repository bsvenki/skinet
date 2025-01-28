using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Entities.AppointmentAgreegate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
   
    public class AppointmentController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

       // private readonly IGenericRepository<AppointmentSlot> _appointmentSlotRepo;

        //private readonly IAppointmentRepository _therapistTherapyRepo;
        

        private readonly IGenericRepository<Therapy> _therapyRepo;
        private readonly IGenericRepository<Therapist> _therapistRepo;

        private readonly IGenericRepository<TherapistTherapy> _therapistTherapyRepo;

         private readonly IGenericRepository<Appointment> _appointmentRepo;

        public AppointmentController(IMapper mapper, IUnitOfWork unitOfWork, 
                                        IGenericRepository<TherapistTherapy> appointRepo,
                                        IGenericRepository<Therapy> therapyRepo,
                                        IGenericRepository<Therapist> therapistRepo,
                                        IGenericRepository<Appointment> appointmentRepo
                                    )
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            //_appointmentSlotRepo = appointmentSlotRepo;
            _therapistTherapyRepo = appointRepo;
            _therapyRepo = therapyRepo;
            _therapistRepo = therapistRepo;
            _appointmentRepo = appointmentRepo;
        }

        [HttpGet]              
        public async Task<ActionResult<IReadOnlyList<AppointmentDto>>> GetAppointments([FromQuery]AppointmentSpecParams appointmentParams)
        {
            //return Ok(await _unitOfWork.Repository<AppointmentSlot>().ListAllAsync());

            var spec = new AppointmentSpecification(appointmentParams); 

            //var appointments = await _unitOfWork.Repository<Appointment>().ListAllAsync();
            
           var appointments = await _appointmentRepo.ListAsync(spec);

           

            return Ok(appointments.Select(appointment => new AppointmentDto
            {
                    Id = appointment.Id,
                    PatientId = appointment.PatientId,
                    BookingTypeId = appointment.BookingTypeId,
                    TherapyCategoryId = appointment.TherapyCategoryId,
                    TherapistTherapyId = appointment.TherapistTherapyId,
                    DoctorId = appointment.DoctorId,
                    Title = appointment.Title,                    
                    Start = appointment.Startdate,
                    End = appointment.Enddate, 
                    Status = appointment.Status,                   
                    
                   
            }).ToList());
        }


        
        //[Authorize(Roles = "Admin")]
       [HttpPost]
       public async Task<ActionResult<AppointmentDto>> CreateAppointment(AppointmentDto appointmentToCreate)
        {
             
            var appointment = _mapper.Map<AppointmentDto, Appointment>(appointmentToCreate);

            
            _unitOfWork.Repository<Appointment>().Add(appointment);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem creating appointment"));

            //return _mapper.Map<ProductBrand, BrandToReturnDto>(brand);

            return appointmentToCreate;
        }


        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<AppointmentDto>> UpdateAppointment(int id, AppointmentDto appointmentToUpdate)
        {
            var appointment = await _unitOfWork.Repository<Appointment>().GetByIdAsync(id);

            //appointment.Startdate =  Convert.ToDateTime(appointmentToUpdate.start);
            //appointment.Enddate = Convert.ToDateTime(appointmentToUpdate.end);

             _mapper.Map(appointmentToUpdate, appointment);

           
            //_mapper.Map(appointmentToUpdate, appointment);

            _unitOfWork.Repository<Appointment>().Update(appointment);
            

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem updating appointment"));

            //return _mapper.Map<ProductBrand, BrandToReturnDto>(brand);
            return appointmentToUpdate;
        }
        
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            var appointment = await _unitOfWork.Repository<Appointment>().GetByIdAsync(id);

                        
            _unitOfWork.Repository<Appointment>().Delete(appointment);

            var result = await _unitOfWork.Complete();
            
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem deleting appointment"));

            return Ok();
        }


        [HttpGet("patients")]
        public async Task<ActionResult<IReadOnlyList<Patient>>> GetPatients()
        {
            var patiens = await _unitOfWork.Repository<Patient>().ListAllAsync();
           // var productBrands = await _repo.GetProductBrandsAsync();
            return Ok(patiens);

            // return Ok(await _repo.GetProductBrandsAsync());
        }

        [HttpGet("bookingtypes")]
        public async Task<ActionResult<IReadOnlyList<BookingType>>> GetBookingTypes()
        {
            var bookingtypes = await _unitOfWork.Repository<BookingType>().ListAllAsync();           
            return Ok(bookingtypes);

            // return Ok(await _repo.GetProductBrandsAsync());
        }

        [HttpGet("therapycategories")]
        public async Task<ActionResult<IReadOnlyList<TherapyCategory>>> GetTherapyCategories()
        {
            var therapycategories = await _unitOfWork.Repository<TherapyCategory>().ListAllAsync();  
           
            //var therapycategories = await _therapistTherapyRepo.GetTherapyCategoriesAsync();
            return Ok(therapycategories);

            // return Ok(await _repo.GetProductBrandsAsync());
        }

        
        [HttpGet("therapysbycategory/{id}")]
        public async Task<ActionResult<IReadOnlyList<Therapy>>> GetTherapysByCategoryId(int id)
        {
           // var therapys = await _unitOfWork.Repository<TherapyCategory>().ListAllAsync();  
           
            var spec = new TherapyWithCategoriesSpecification(id);
            var therapys = await _therapyRepo.ListAsync(spec);
            return Ok(therapys);

            // return Ok(await _repo.GetProductBrandsAsync());
        }


        
        [HttpGet("therapists")]
        public async Task<ActionResult<IReadOnlyList<Therapist>>> GetTherapists()
        {
            var therapists = await _unitOfWork.Repository<Therapist>().ListAllAsync();           
            return Ok(therapists);
        }

        [HttpGet("doctors")]
        public async Task<ActionResult<IReadOnlyList<Doctor>>> GetDoctors()
        {
            var doctors = await _unitOfWork.Repository<Doctor>().ListAllAsync();           
            return Ok(doctors);
        }

        [HttpGet("therapistsbytherapy")]
        public async Task<ActionResult<IReadOnlyList<TherapistTherapy>>> GetTherapistsByThearapyId([FromQuery]int therapyId)
        {
            //var therapycategories = await _unitOfWork.Repository<TherapyCategory>().ListAllAsync();  
           
           var spec = new TherapistWithTherapySpecification(therapyId); 
           var therapists = await _therapistTherapyRepo.ListAsync(spec);

            //var therapists = await _therapistTherapyRepo.GetTherapistsByTherapyIdAsync(therapyid);
            return Ok(therapists);

            // return Ok(await _repo.GetProductBrandsAsync());
        }
        
    }
}