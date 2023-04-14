import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { UserInterface } from './Interface/userInterface';
import {product as ProductInterface} from './Interface/productInterface';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import { cartInterface as CartInterface } from './Interface/cartInterface';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userList:UserInterface[] = [];
  productList:ProductInterface[] = [];
  
  constructor(private userService:UserService,private authService:AuthService,private cartService:CartService,private productService:ProductService){
    
  }

  ngOnInit() {
    this.cartService.setCartLoaded(false);
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartService.populateCart();
    this.cartService.initializeSessionStorage();
  }; 
}
