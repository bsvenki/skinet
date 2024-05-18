using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class ProductItemOrdered
    {
        public ProductItemOrdered()
        {
        }
        
        public ProductItemOrdered(int producItemId, string productName, string pictureUrl)
        {
            ProducItemId = producItemId;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }
        

        public int ProducItemId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
    }
}