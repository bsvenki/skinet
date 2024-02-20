namespace Core.Entities
{
    public class Product : BaseEntity
    {
        // Derived from BaseEntity
        //public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }

        // Related entities // EF migration will identify and create relationship
        public ProductType ProductType { get; set; }
        public int ProductTypeId { get; set; }

        // Related entities // EF migration will identify and create relationship
        public ProductBrand ProductBrand{ get; set; }

        public int ProductBrandId { get; set; }

    }

   
}