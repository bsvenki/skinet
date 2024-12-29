
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map, delay, pluck } from 'rxjs/operators';
import { IAppointment } from 'src/app/shared/models/appointment';
import { environment } from 'src/environments/environment';
import { EventInput } from '@fullcalendar/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { I } from '@fullcalendar/core/internal-common';


@Injectable({
    providedIn: 'root'
  })

export class AppointmentService {

    baseUrl = environment.apiUrl;
    appointments: IAppointment[] = [];
    initialEvents: EventInput[] = [];
    
  constructor(private http: HttpClient) { }

  getAppointments(){        
        return this.http.get<IAppointment[]>(this.baseUrl + 'Appointment');        
  }

  createBrand(appointment : IAppointment) {
    return this.http.post(this.baseUrl + 'Appointment', appointment);
  }




}

   

    

    


/*
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ProductFormValues} from '../shared/models/product';
import {BrandFormValues, IBrand} from '../shared/models/brand';
import {TypeFormValues, IType} from '../shared/models/productType';
import {CategoryFormValues, ICategory} from '../shared/models/category';
import {SizeFormValues, ISize } from '../shared/models/productSize';
import {HttpClient} from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { IUser } from '../shared/models/user';
import { IParameter } from '../shared/models/parameter';
import { DeliveryMethodFormValues, IDeliveryMethod } from '../shared/models/deliveryMethod';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  brands: IBrand[] = [];
  types: IType[] = [];
  categories: ICategory[] = [];
  sizes: ISize[] = [];
  parameter: IParameter;
  parameters: IParameter[] = [];
  deliverymethods: IDeliveryMethod[] = [];

  constructor(private http: HttpClient) {
  }

  createProduct(product: ProductFormValues) {
    return this.http.post(this.baseUrl + 'products', product);
  }

  updateProduct(product: ProductFormValues, id: number) {
    return this.http.put(this.baseUrl + 'products/' + id, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }

  uploadImage(file: File, id: number) {
    const formData = new FormData();
    formData.append('photo', file, 'image.png');
    return this.http.put(this.baseUrl + 'products/' + id + '/photo', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteProductPhoto(photoId: number, productId: number) {
    return this.http.delete(this.baseUrl + 'products/' + productId + '/photo/' + photoId);
  }

  setMainPhoto(photoId: number, productId: number) {
    return this.http.post(this.baseUrl + 'products/' + productId + '/photo/' + photoId, {});
  }

  applyDiscount(discount:number, discounttype: string, productselected: string, selectall: boolean ) {    
    return this.http.post(this.baseUrl + 'products/updateproductprize?discount=' + discount + '&discounttype=' + discounttype + '&productselected=' + productselected + '&selectall=' + selectall,{});
  } 

  createBrand(brand : BrandFormValues) {
    return this.http.post(this.baseUrl + 'brands', brand);
  }

  updateBrand(brand: BrandFormValues, id: number) {
    return this.http.put(this.baseUrl + 'brands/' + id, brand);
  }

  deleteBrand(id: number) {
    return this.http.delete(this.baseUrl + 'brands/' + id);
  }

  getBrandById(id: number) {    
    return this.http.get<IBrand>(this.baseUrl + 'brands/' + id);
  }

  getBrands() {   
    return this.http.get<IBrand[]>(this.baseUrl + 'brands').pipe(
      map(response => {
        this.brands = response;
        return response;
      })
    );
  }


  createType(type : TypeFormValues) {
    return this.http.post(this.baseUrl + 'types', type);
  }

  updateType(type: TypeFormValues, id: number) {
    return this.http.put(this.baseUrl + 'types/' + id, type);
  }

  deleteType(id: number) {
    return this.http.delete(this.baseUrl + 'types/' + id);
  }

  getTypeById(id: number) {    
    return this.http.get<IType>(this.baseUrl + 'types/' + id);
  }

 

  getTypes() {   
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map(response => {
        this.types = response;
        return response;
      })
    );
  }



  createCategory(category : CategoryFormValues) {
    return this.http.post(this.baseUrl + 'categories', category);
  }

  updateCategory(category: CategoryFormValues, id: number) {
    return this.http.put(this.baseUrl + 'categories/' + id, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(this.baseUrl + 'categories/' + id);
  }

  getCategoryById(id: number) {    
    return this.http.get<ICategory>(this.baseUrl + 'categories/' + id);
  }
  

  getCategories() {   
    return this.http.get<ICategory[]>(this.baseUrl + 'categories').pipe(
      map(response => {
        this.categories = response;
        return response;
      })
    );
  }

  uploadCategoryImage(file: File, id: number) {
    const formData = new FormData();
    formData.append('PhotoCategory', file, 'image.png');
    return this.http.put(this.baseUrl + 'categories/' + id + '/categoryphoto', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteCategoryPhoto(photoId: number, categoryId: number) {
    return this.http.delete(this.baseUrl + 'categories/' + categoryId + '/categoryphoto/' + photoId);
  }

  setCategoryMainPhoto(photoId: number, categoryId: number) {
    return this.http.post(this.baseUrl + 'categories/' + categoryId + '/categoryphoto/' + photoId, {});
  }


  getUsersWithRoles() {
    return this.http.get<Partial<IUser[]>>(this.baseUrl + "admin/users-with-roles");
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }


  createSize(size : SizeFormValues) {
    return this.http.post(this.baseUrl + 'sizes', size);
  }

  updateSize(size: SizeFormValues, id: number) {
    return this.http.put(this.baseUrl + 'sizes/' + id, size);
  }

  deleteSize(id: number) {
    return this.http.delete(this.baseUrl + 'sizes/' + id);
  }

  getSizeById(id: number) {    
    return this.http.get<ISize>(this.baseUrl + 'sizes/' + id);
  }

 

  getSizes() {   
    return this.http.get<ISize[]>(this.baseUrl + 'sizes').pipe(
      map(response => {        
        //this.sizes = response;
        this.sizes = [{ id: 0, description: '', name: '' }, ...response];
        return response;
      })
    );
  }


  getParmeterValueByKey(paramkey: string) {    
    return this.http.get<IParameter>(this.baseUrl + 'parameters/parameterkey?parameterkey=' + paramkey);
  }

  getParameters()
  {
    return this.http.get<IParameter[]>(this.baseUrl + 'parameters').pipe(
      map(response => {
        this.parameters = response;
        return response;
      })
    );
  }

  updatePrameter(parameter: IParameter, id: number) {
    return this.http.put(this.baseUrl + 'parameters/' + id, parameter);
  }


  createDeliveryMethod(deliveryMethod : DeliveryMethodFormValues) {
    return this.http.post(this.baseUrl + 'deliverymethods', deliveryMethod);
  }

  updateDeliveryMethod(deliveryMethod: DeliveryMethodFormValues, id: number) {
    return this.http.put(this.baseUrl + 'deliverymethods/' + id, deliveryMethod);
  }

  deleteDelieveryMethod(id: number) {
    return this.http.delete(this.baseUrl + 'deliverymethods/' + id);
  }

  getDeliveryMethodById(id: number) {    
    return this.http.get<IDeliveryMethod>(this.baseUrl + 'deliverymethods/' + id);
  }

 

  getDeliveryMethods() {   
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'deliverymethods').pipe(
      map(response => {        
        //this.sizes = response;
        this.deliverymethods = [...response];
        return response;
      })
    );
  }




}

 getAppointmentsNew(): Observable<IAppointment[]> {
    return this.http.get<any[]>(this.baseUrl + 'Appointment').pipe(
      map((response) => 
        response.map(iappointment => ({
          id: iappointment.id,
          title: iappointment.title,  // Mapping the API property to the Angular property
          start: iappointment.start,
          end: iappointment.end
        })) 
      )
    );
  }
*/