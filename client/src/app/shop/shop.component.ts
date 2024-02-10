import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/models/product';
import { Type } from '../shared/models/type';
import { Brand } from '../shared/models/brand';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParams = new ShopParams();
  //brandIdSelected = 0;
  //typeIdSelected = 0;
  //sortSelected = 'name';
  sortOptions = [
    {name: 'Alphabetical', value:'name'},
    {name: 'Price: Low to high', value:'priceAsc'},
    {name: 'Price: High to low', value:'priceDesc'}
  ];
  totalCount = 0;
$event: any;
  
  constructor(private shopService: ShopService){}
  
  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  // For Pagination response.data required
  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
    //this.shopService.getProducts(this.brandIdSelected,this.typeIdSelected,this.sortSelected).subscribe({
    // next: response => this.products = response,
      next: response => {
        this.products = response;
        //this.shopParams.pageNumber = response.pageIndex;
        //this.shopParams.pageSize = response.pageSize;
        //this.totalCount = response.count;

      },
      error: error => console.log(error)
    })
  }

  // No pagination so response.data not required
  getBrands(){
    this.shopService.getBrands().subscribe({
      //next: response => this.brands = response,
      next: response => this.brands = [{id:0, name:'All'},...response],
      error: error => console.log(error)
    })
  }

  // No pagination so response.data not required
  getTypes(){
    this.shopService.getTypes().subscribe({
      //next: response => this.types = response,
      next: response => this.types = [{id:0, name:'All'},...response],
      error: error => console.log(error)
    })
  }

  onBrandSelected(brandId: number){
    //this.brandIdSelected = brandId;
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    //this.typeIdSelected = typeId;
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event: any){
    this.shopParams.sort = event.target.value;
    //this.sortSelected = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: any){
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch(){
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }

}
