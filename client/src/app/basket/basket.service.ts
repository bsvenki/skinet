import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})

// Inside the service, this is a singleton class
// basketSource will not be disposed until the application disposes
export class BasketService {

  baseUrl = environment.apiUrl;
  // behaviorsubject in from RxJS
  private basketSource = new BehaviorSubject<Basket | null>(null);

  // basketSource$ is obervable that is the convention to use $ symbol for observable
  // others can subscribe to basketSource$ observalbe and notify the changes if any
  basketSource$ = this.basketSource.asObservable();

  // create observalbe for basket total
  // Will have basket total or null value and it is initialised with null value
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);  
  basketTotalSource$ = this.basketTotalSource.asObservable();
  shipping = 0;



  constructor(private http: HttpClient) { }

  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price;
    this.calcuateTotals();

  }

  getBasket(id: string){
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calcuateTotals();        
      }
    })
  }

  setBasket(basket: Basket){
    return this.http.post<Basket>(this.baseUrl + 'basket', basket).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calcuateTotals();
      }
    })
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item: Product | BasketItem, quantity = 1){
    if(this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    //const itemToAdd = this.mapProductItemToBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  removeItemFromBasket(id: number, quantity = 1){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;
    const item = basket.items.find(x => x.id === id);
    if(item){
      item.quantity -= quantity;
      if(item.quantity === 0){
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if(basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket);
      
    }
  }

  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.deleteLocalBasket();
      }
    })
  }

  deleteLocalBasket(){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number) {
    const item = items.find(x => x.id === itemToAdd.id);
    if(item) item.quantity += quantity;
    else{
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }

  createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('baket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: Product) : BasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private calcuateTotals(){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;    
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + this.shipping;
    this.basketTotalSource.next({shipping: this.shipping,total, subtotal});
  }

  // identify product or basketitem using product property ProductBrand
  private isProduct(item: Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined;
  }
}
