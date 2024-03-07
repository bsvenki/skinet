using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statuscode, string message = null)
        {
            StatusCode = statuscode;
            Message = message ?? GetDefaultMessageForStatusCode(statuscode);
            
        }


        public int StatusCode { get; set; }
        public string Message { get; set; }

        
        private string GetDefaultMessageForStatusCode(int statuscode)
        {
            return StatusCode switch
            {
                400 => "A bad request, you have made",
                401 => "Authorized, you are not",
                404 => "Resource found, it was not",
                500 => "Errors are the path to the dark side. Error leads to Anger. Anger leads to hate. Hate leads to career change",
                _ => null
            };
        }
      

      
    }
}