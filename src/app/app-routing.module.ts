import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { OrderUploadComponent } from './components/order-upload/order-upload.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginGuardService } from './services/login-guard.service';
const routes: Routes = [
  {
    path:'',
    component:ProductsComponent
  },
  {
    path:'products',
    component:ProductsComponent
  },
  {
    path:'product/:sku_id',
    component:ProductDetailsComponent
  },
  {
    path:'cart',
    component:CartComponent
  },
  {
    path:'orderUpload',
    component:OrderUploadComponent
  },
  {
    path:'login',
    component:LoginComponent,
    canActivate:[LoginGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
