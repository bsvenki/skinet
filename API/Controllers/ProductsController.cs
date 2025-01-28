using System.Numerics;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(
            IGenericRepository<Product> productsRepo, 
            IGenericRepository<ProductBrand> productBrandRepo,
            IGenericRepository<ProductType> productTypeRepo,
            IMapper mapper)
        {
            _productsRepo = productsRepo;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
        }

        //private readonly IProductRepository _repo;
        /*
        public ProductsController(IProductRepository repo)
        {
            _repo = repo;
            
        }
        */

        /*
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;
        }
        */

        [HttpGet]
        // public async Task<ActionResult<List<Product>>> GetProducts()
        // public async Task<ActionResult<List<ProductToRetrunDto>>> GetProducts()
        // public async Task<ActionResult<IReadOnlyList<ProductToRetrunDto>>> GetProducts(
                //string sort,int? brandId, int? typeId)

        // HTTP Get so cannot pass object, so used FromQuery
        //  public async Task<ActionResult<IReadOnlyList<ProductToRetrunDto>>> GetProducts
        public async Task<ActionResult<Pagination<ProductToRetrunDto>>> GetProducts(
                [FromQuery]ProductSpecParams productParams)
        {

           var spec = new ProductsWithTypesAndBrandsSpecification(productParams); 
           var products = await _productsRepo.ListAsync(spec);

           var countSpec = new ProductsWithFiltersForCountSpecification(productParams);

           var totalItems = await _productsRepo.CounAsync(countSpec);

           //var products = await _productsRepo.ListAllAsync();
            // var products = await _repo.GetProductsAsync();
            //var products = await _context.Products.ToListAsync();

           // return Ok(products);
           // Used Automapper
           /*
           return products.Select(product => new ProductToRetrunDto
           {

                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                Price = product.Price,
                ProductBrand = product.ProductBrand.Name,
                ProductType = product.ProductType.Name

           }).ToList();
           */
           
           /*
           return Ok(_mapper
           .Map<IReadOnlyList<Product>,IReadOnlyList<ProductToRetrunDto>>(products));
           */

            var data = _mapper
                            .Map<IReadOnlyList<Product>,IReadOnlyList<ProductToRetrunDto>>(products);

            return Ok(new Pagination<ProductToRetrunDto>(productParams.PageIndex,productParams.PageSize,totalItems,data));


        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse),StatusCodes.Status404NotFound)]
        //public async Task<ActionResult<Product>> GetProduct(int id)
        public async Task<ActionResult<ProductToRetrunDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            
            var product = await _productsRepo.GetEntityWithSpec(spec);

            if(product == null) return NotFound(new ApiResponse(404));

            // Used Automapper
            /*
            return new ProductToRetrunDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                Price = product.Price,
                ProductBrand = product.ProductBrand.Name,
                ProductType = product.ProductType.Name

            };
            */

            return _mapper.Map<Product,ProductToRetrunDto>(product);

            //Instead returning full product entity will return product DTO
            //return await _productsRepo.GetEntityWithSpec(spec);

            //return await _productsRepo.GetByIdAsync(id);
            // return await _repo.GetProductByIdAsync(id);
            //return await _context.Products.FindAsync(id);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var productBrands = await _productBrandRepo.ListAllAsync();
           // var productBrands = await _repo.GetProductBrandsAsync();
            return Ok(productBrands);

            // return Ok(await _repo.GetProductBrandsAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            //var productBrands = await _repo.GetProductBrandsAsync();
            //return Ok(productBrands);

            return Ok(await _productTypeRepo.ListAllAsync());
            //return Ok(await _repo.GetProductTypessAsync());
        }

    }
}