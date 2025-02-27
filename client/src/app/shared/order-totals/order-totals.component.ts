import { Component } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
    selector: 'app-order-totals',
    templateUrl: './order-totals.component.html',
    styleUrls: ['./order-totals.component.scss'],
    standalone: false
})
export class OrderTotalsComponent {

  constructor(public basketService: BasketService){}

}
