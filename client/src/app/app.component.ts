import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'Skinet';
   //products: any[] = []; //products array is of any type
   //products: Product[] = []; //products arrayis of type Product

  constructor(private basketService: BasketService,private accountService: AccountService,public breadcrumbService: BreadcrumbService){}
  
  ngOnInit(): void {
    //const basketId = localStorage.getItem('baket_id');
    //if(basketId) this.basketService.getBasket(basketId);
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadBasket(){
    const basketId = localStorage.getItem('baket_id');
    if(basketId) this.basketService.getBasket(basketId);
  }

  loadCurrentUser(){
    const token = localStorage.getItem('token');
    //if (token) this.accountService.loadCurrentUser(token).subscribe();
    this.accountService.loadCurrentUser(token).subscribe();
  }

  /* move to shop service
  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/products').subscribe({      
      next: (response: any) => this.products = response, //next: response => console.log(response), // what to do next
      error: error => console.log(error), // what do do if there is an error
      complete: () =>{
        console.log('request completed');
        console.log('extra statement');
      }
    })
  */
  
}
