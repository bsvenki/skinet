using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
       // private readonly IGenericRepository<Order> _orderRepo;
       // private readonly IGenericRepository<DeliveryMethod> _dmRepo;
        private readonly IBasketRepository _basketRepo;

        //private readonly IGenericRepository<Product> _productRepo;
         private readonly IUnitOfWork _unitOfWork;

        // Refactored below for unit of work
        /*
        public OrderService(IGenericRepository<Order> orderRepo, IGenericRepository<DeliveryMethod> dmRepo, 
                            IGenericRepository<Product> productRepo, IBasketRepository basketRepo)
        {
          
            _dmRepo = dmRepo;
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _basketRepo = basketRepo;
        }
        */
       

        public OrderService(IBasketRepository basketRepo, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
        }


        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
           // get basket from the repo
           var basket = await  _basketRepo.GetBasketAsync(basketId);
           
           // get items from the product repo
           var items = new List<OrderItem>();
           foreach(var item in basket.Items)
           {
              // refactored for unit of work
              //var productItem = await _productRepo.GetByIdAsync(item.Id);
              var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
              var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
              var orderItem = new OrderItem(itemOrdered, productItem.Price,item.Quantity);
              items.Add(orderItem);
           }

           // get delivery method from repo
           // refactored for unit of work
           // var deliveryMethod = await _dmRepo.GetByIdAsync(deliveryMethodId);
           var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
           
           // calc subtotal
           var subtotal = items.Sum(item => item.Price * item.Quantity);
           
           // create order
           var order = new Order(items, buyerEmail, shippingAddress,deliveryMethod, subtotal);

          
           _unitOfWork.Repository<Order>().Add(order);

            // Save to db
            var result = await _unitOfWork.Complete();

            if(result <= 0) return null;

            // delete basket
            await _basketRepo.DeleteBasketAsync(basketId);





           // return order
           return order;
           


        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrderForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}