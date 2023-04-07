import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private authService:AuthService) { }

  ngOnInit(){
    if(!localStorage.getItem('cart'))
    {
      localStorage.setItem('cart',JSON.stringify({"untraced":{}}));
    }
    else{
      this.validateCart();
    }
  }

  addToCart(sku_id:string){
    let items:any = localStorage.getItem('cart')?.toString();
    let cart = JSON.parse(items);
    let email = localStorage.getItem('email');
    //when logged in
    if(email!=null){
      if(this.authService.isValidUser(email)){
          cart[email][sku_id] = 1;
      }
      else{
        
      }
    }
    
  }

  increaseQuantity(sku_id:string){

  }

  decreaseQuantity(sku_id:string){

  }

  updateQuantity(sku_id:string,quantity:number){

  }

  validateCart(){
    let cart = JSON.stringify(localStorage.getItem('cart'));
    let email = localStorage.getItem('user');
    //validate user
    //check if user is removed from localStorage 
    if(email!=null){
      if(this.authService.isValidUser(email)){
        
      }
      else{

      }
    }
    //check for validity of cart items like negative quantity check,
    // quantity string,duplicate ids,false ids
    //check if cart object is removed from localStorage
    
  }
}

// cart:{
//   "email1":{"item sku":1,"item sku2":2},
//   "email2":{"item sku":4,"item sku2":5},
//   "untraced Items":{"item sku1":2,"item sku2":5}
// }
