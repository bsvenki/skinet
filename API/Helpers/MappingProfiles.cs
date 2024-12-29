using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Appointment;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfiles:Profile
    {
        public MappingProfiles()
        {
            //CreateMap<Product, ProductToRetrunDto>();

            // d destination  // s soruce

            // CreateMap<Product, ProductToRetrunDto>()
            //    .ForMember(d=> d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
            //    .ForMember(d=> d.ProductType,o => o.MapFrom(s => s.ProductType.Name));

            // Used URL Resolver for Picture URl
            CreateMap<Product, ProductToRetrunDto>()
                .ForMember(d=> d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
                .ForMember(d=> d.ProductType,o => o.MapFrom(s => s.ProductType.Name))
                .ForMember(d=> d.PictureUrl,o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();

            CreateMap<Order, OrderToReturnDto>()
              .ForMember(d=> d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
              .ForMember(d=> d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));                

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d=> d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProducItemId))
                .ForMember(d=> d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d=> d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl))
                .ForMember(d=> d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());

            CreateMap<AppointmentDto, AppointmentSlot>()
                .ForMember(d=> d.DoctorId, o => o.MapFrom(s => s.doctorId))
                .ForMember(d=> d.Startdate, o => o.MapFrom(s => s.start))
                .ForMember(d=> d.Enddate, o => o.MapFrom(s => s.end));
                
        }
    }
}