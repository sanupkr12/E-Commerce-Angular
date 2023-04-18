import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { OrderUploadComponent } from './order-upload/order-upload.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule} from "@angular/common/http"
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProductsComponent,
    ProductDetailsComponent,
    CartComponent,
    OrderUploadComponent,
    LoginComponent,
    ProductCardComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService,UserService,ProductService,CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
