import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserInterface } from './Interface/userInterface';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import {product as ProductInterface} from "./Interface/productInterface";
@Injectable({
  providedIn: 'root'
})
export class CartService {
  userList:UserInterface[] = [];
  productList:ProductInterface[] = [];
  constructor(private authService:AuthService,private userService:UserService,private productService:ProductService) { }

  addToCart(sku_id:string){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(email!=null){
        if(!cart){
          localStorage.setItem('cart',JSON.stringify({[email]:{[sku_id]:1},'untracked':{}}));
        }
        else{
          cart[email] = {...cart[email],[sku_id]:1};
        }
    }  
    else{
      cart['untracked'] = {[sku_id]:1,...cart['untracked']};
    }
    localStorage.setItem('cart',JSON.stringify(cart));
  }

  increaseQuantity(sku_id:string){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{[sku_id]:1},'untracked':{}}));
      }
      else{
        if(cart[email][sku_id]<0){
          delete cart[email][sku_id];
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        else{
          cart[email][sku_id]+=1;
          localStorage.setItem('cart',JSON.stringify(cart));
        }
      }
    }
    else{
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{[sku_id]:1}}));
      }
      else{
        if(cart['untracked'][sku_id]<0){
          delete cart['untracked'][sku_id];
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        else{
          cart['untracked'][sku_id]+=1;
          localStorage.setItem('cart',JSON.stringify(cart));
        }
      }
    }
  }

  decreaseQuantity(sku_id:string){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}));
      }
      else{
        if(cart[email][sku_id]<=0)
        {
          delete cart[email][sku_id];
        }
        else{
          cart[email][sku_id]-=1;
        }
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
    else{
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{}}));
      }
      else{
        if(cart['untracked'][sku_id]<=0)
        {
          delete cart['untracked'][sku_id];
        }
        else{
          cart['untracked'][sku_id]-=1;
        }
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
  }

  updateQuantity(sku_id:string,quantity:number){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{[sku_id]:quantity<=0?0:quantity},'untracked':{}}));
      }
      else{
        cart[email][sku_id] = quantity<=0 ? 0:quantity;
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
    else{
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{[sku_id]:quantity<=0?0:quantity}}));
      }
      else{
        cart['untracked'][sku_id] = quantity<=0?0:quantity;
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
  }

  initializeCart(){
    const email = localStorage.getItem('email');
    if(email!=null){
      let cart = localStorage.getItem('cart');
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}));
      }
      else{
        let cartObj = JSON.parse(cart);
        console.log(cartObj[email]);
        cartObj[email] = {...cartObj[email],...cartObj['untracked']};
        cartObj['untracked'] = {};
        localStorage.setItem('cart',JSON.stringify(cartObj));
      }
    }
    else{
      let cart = localStorage.getItem('cart');
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{}}));
      }
    }
  }

  validateCart(){
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    const email = localStorage.getItem('user');
    this.userService.getUsersList().subscribe((users:any)=>{
      this.userList = users.credentials;
        if(email!=null){
          let isValidUser = false;
          for(let i=0;i<this.userList.length;i++){
            if(this.userList[i].email === email){
              isValidUser = true;
              break;
            }
          }
          if(!isValidUser){
            localStorage.removeItem('email');
          }
        }
    })
    this.productService.getProducts().subscribe((products:any)=>{
      this.productList = products.products;
      for(const key in cart){
        for(const item in cart[key]){
          let isValid = false;
          for(let i=0;i<this.productList.length;i++){
            if(this.productList[i].sku_id===item){
              isValid = true;
              break;
            }
          }
          if(!isValid){
            delete cart[key][item];
          }
          else{
            if(cart[key][item]<=0 || isNaN(cart[key][item])){
              delete cart[key][item];
            }
          }
        }
      }
      localStorage.setItem('cart',JSON.stringify(cart));
    }) 
  }
}

// cart:{
//   "email1":{"item sku":1,"item sku2":2},
//   "email2":{"item sku":4,"item sku2":5},
//   "untraced Items":{"item sku1":2,"item sku2":5}
// }
