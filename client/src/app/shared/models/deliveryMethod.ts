export interface IDeliveryMethod {
    shortName: string;
    deliveryTime: string;
    description: string;
    price: number;
    id: number;
    isDisplay: boolean;
}

export interface IDeliveryMethodToCreate {
    shortName: string;
    deliveryTime: string;
    description: string;
    price: number;    
    isDisplay: boolean;  
  }
  
  export class DeliveryMethodFormValues implements IDeliveryMethodToCreate {
    shortName = '';
    deliveryTime = ''; 
    description = '';
    price: any;
    isDisplay = false;
  
    constructor(init?: DeliveryMethodFormValues) {
      Object.assign(this, init);
    }
  }