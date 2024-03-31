using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

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

            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
        }
    }
}