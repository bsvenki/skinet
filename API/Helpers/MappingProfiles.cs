using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.AppointmentAgreegate;
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

            CreateMap<AppointmentDto, Appointment>()
                //.ForMember(d=> d.TherapistTherapyId, o => o.MapFrom(s => s.TherapistTherapyId))
                .ForMember(d=> d.Startdate, o => o.MapFrom(s => s.Start))
                .ForMember(d=> d.Enddate, o => o.MapFrom(s => s.End));
                
                
                
        }
    }
}