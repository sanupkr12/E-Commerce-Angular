import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { OrderUploadComponent } from './order-upload/order-upload.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path:'products',
    component:ProductsComponent
  },
  {
    path:'product/:id',
    component:ProductDetailsComponent
  },
  {
    path:'cart',
    component:CartComponent
  },
  {
    path:'orderUpload',
    component:OrderUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
