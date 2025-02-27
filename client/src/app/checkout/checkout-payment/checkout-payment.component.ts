import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { NavigationExtras, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@Component({
    selector: 'app-checkout-payment',   
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss'],
    standalone: false
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService,
                                                    private toastr: ToastrService,
                                                    private router: Router) {}
  
  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if(!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    if(!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: order => {
        //console.log(order);
        // implement validation to check for order creation
        if(order.id != null)
        {
          this.toastr.success('Order created successfully');
          this.basketService.deleteLocalBasket();        
          const navigationExtras: NavigationExtras = {state: order};
          this.router.navigate(['checkout/success'], navigationExtras);
        }
        else
        {
          this.toastr.error('Order creation failed');
        }
      }
    })
  }  

  private getOrderToCreate(basket: Basket) {
    const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if(!deliveryMethodId || !shipToAddress) return;
    return{
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress
    }
  }

}



