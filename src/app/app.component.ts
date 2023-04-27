import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { UserInterface } from './common/interfaces/user.types';
import { ProductInterface} from './common/interfaces/product.types';
import { UserService } from './common/services/user.service';
import { AuthService } from './common/services/auth.service';
import { CartService } from './common/services/cart.service';
import { ProductService } from './common/services/product.service';
import { cartInterface as CartInterface } from './common/interfaces/cart.types';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // userList:UserInterface[] = [];
  // productList:ProductInterface[] = [];
  
  constructor(private userService:UserService,private authService:AuthService,private cartService:CartService,private productService:ProductService){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartService.populateCart();
    this.cartService.initializeSessionStorage();
  } 
}
