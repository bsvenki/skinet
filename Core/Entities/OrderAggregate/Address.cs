using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class Address
    {
        // EF core expects a parameterless constructor
        public Address()
        {
        }

        public Address(string FirstName, string LastName, string Street, string City, string State, string ZipCode)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Street = Street;
            this.City = City;
            this.State = State;
            this.ZipCode = ZipCode;
        }
       

        public string FirstName { get; set; }
        public string LastName { get; set; }        
        public string Street { get; set; }        
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set;}
    }
}