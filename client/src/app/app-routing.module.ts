import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CalendarComponent } from './calendarng/calendarng.component';
import { PatientComponent } from './appointment/patient/patient.component';

const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}}, 
  {path: 'cnng', component: CalendarComponent},  
  {path: 'patient', component: PatientComponent},
  {path: 'test-error', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent}, 
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule)},
  {
    path: 'checkout', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule),
    data: { breadcrumb: 'Orders' }
  },
  {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},    
  {path: '**', redirectTo: '',pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
