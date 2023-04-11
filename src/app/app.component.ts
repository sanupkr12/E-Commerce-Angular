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
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.populateCart();
  };

  populateCart(){
    this.productService.getProducts().subscribe((products:any)=>{
      const productList = products.products;
      let cart = JSON.parse(localStorage.getItem('cart')||'');
      const email = localStorage.getItem('email');
      if(!email){
        if(!cart){
          localStorage.setItem('cart',JSON.stringify({'untracked':{}}));
        }
        else{
          //do something with untracked items
          let res:CartInterface[] = [];
          for(let key in cart['untracked']){
            let quantity:number = cart['untracked'][key];
            for(let i=0;i<productList.length;i++){
              if(productList[i].sku_id === key){
                res.push({product:{...productList[i]},'quantity':quantity});
                break;
              }
            }
          }
          this.cartService.setCart(res);
        }
      }
      else{
        if(!cart){
          localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}))
        }
        else{
          //do somthing with currently logged in user
          let res:CartInterface[]= [];
          for(let key in cart[email]){
            let quantity:number = cart[email][key];
            for(let i=0;i<productList.length;i++){
              if(productList[i].sku_id === key){
                res.push({product:{...productList[i]},'quantity':quantity});
                break;
              }
            }
          }
          this.cartService.setCart(res);
        }
      }
    })
  }
}
