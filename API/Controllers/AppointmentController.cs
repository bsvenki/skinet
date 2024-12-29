using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Entities.Appointment;
using Core.Interfaces;
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

        public AppointmentController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            //_appointmentSlotRepo = appointmentSlotRepo;
        }

        [HttpGet]              
        public async Task<ActionResult<IReadOnlyList<AppointmentDto>>> GetAppointments()
        {
            //return Ok(await _unitOfWork.Repository<AppointmentSlot>().ListAllAsync());

            var appointments = await _unitOfWork.Repository<AppointmentSlot>().ListAllAsync();
            
           // var productBrands = await _repo.GetProductBrandsAsync();

            return Ok(appointments.Select(appointment => new AppointmentDto
            {
                    id = appointment.Id,
                    start = appointment.Startdate,
                    end = appointment.Enddate,                    
                    Title = appointment.Title
            }).ToList());
        }


        
        //[Authorize(Roles = "Admin")]
       [HttpPost]
       public async Task<ActionResult<AppointmentDto>> CreateAppointment(AppointmentDto appointmentToCreate)
        {
             
            var appointment = _mapper.Map<AppointmentDto, AppointmentSlot>(appointmentToCreate);

            
            _unitOfWork.Repository<AppointmentSlot>().Add(appointment);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem creating appointment"));

            //return _mapper.Map<ProductBrand, BrandToReturnDto>(brand);

            return appointmentToCreate;
        }


        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<AppointmentDto>> UpdateAppointment(int id, AppointmentDto appointmentToUpdate)
        {
            var appointment = await _unitOfWork.Repository<AppointmentSlot>().GetByIdAsync(id);

            //appointment.Startdate =  Convert.ToDateTime(appointmentToUpdate.start);
            //appointment.Enddate = Convert.ToDateTime(appointmentToUpdate.end);

             _mapper.Map(appointmentToUpdate, appointment);

           
            //_mapper.Map(appointmentToUpdate, appointment);

            _unitOfWork.Repository<AppointmentSlot>().Update(appointment);
            

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem updating appointment"));

            //return _mapper.Map<ProductBrand, BrandToReturnDto>(brand);
            return appointmentToUpdate;
        }
        
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            var appointment = await _unitOfWork.Repository<AppointmentSlot>().GetByIdAsync(id);

                        
            _unitOfWork.Repository<AppointmentSlot>().Delete(appointment);

            var result = await _unitOfWork.Complete();
            
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem deleting appointment"));

            return Ok();
        }
        
    }
}