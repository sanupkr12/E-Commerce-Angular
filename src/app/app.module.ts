import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderUploadComponent } from './components/order-upload/order-upload.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule} from "@angular/common/http"
import { AuthService } from './common/services/auth.service';
import { UserService } from './common/services/user.service';
import { ProductService } from './common/services/product.service';
import { CartService } from './common/services/cart.service';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ToastComponent } from './components/toast/toast.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ButtonDirective } from './common/directives/button.directive';

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
    ToastComponent,
    PageNotFoundComponent,
    ButtonDirective
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
