import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';
   //products: any[] = []; //products array is of any type
   //products: Product[] = []; //products arrayis of type Product

  constructor(){}
  ngOnInit(): void {
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
