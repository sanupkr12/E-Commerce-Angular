import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserInterface } from './Interface/userInterface';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import {product as ProductInterface} from "./Interface/productInterface";
import { cartInterface as CartInterface } from './Interface/cartInterface';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  userList:UserInterface[] = [];
  productList:ProductInterface[] = [];
  cartList:CartInterface[] = [];
  cartItems = new Subject<CartInterface[]>;
  constructor(private authService:AuthService,private userService:UserService,private productService:ProductService) { }
  ngOnInit(){
    this.productService.getProducts().subscribe((products:any)=>{
      this.productList = products.products;
    })
  }

  setCart(res:CartInterface[]){
    this.cartList = [...res];
    this.cartItems.next(res);
  }

  getCart(){
    return this.cartItems.asObservable();
  }

  addToCart(sku_id:string){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    let product:ProductInterface = {} as ProductInterface;
    for(let i=0;i<this.productList.length;i++){
      if(this.productList[i].sku_id === sku_id){
        product = this.productList[i];
        break;
      }
    }
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
    this.cartList.push({product:product,'quantity':1});
    localStorage.setItem('cart',JSON.stringify(cart));
    this.setCart(this.cartList);
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
    for(let i=0;i<this.cartList.length;i++){
      if(this.cartList[i].product.sku_id === sku_id)
      { 
        this.cartList[i].quantity += 1;
        break;
      }
    }
    this.setCart(this.cartList);
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
    for(let i=0;i<this.cartList.length;i++){
      if(this.cartList[i].product.sku_id === sku_id)
      { 
        if(this.cartList[i].quantity > 0){
          this.cartList[i].quantity -= 1;
          if(this.cartList[i].quantity===0){
            delete this.cartList[i];
          }
          break;
        }
      }
    }
    this.setCart(this.cartList);
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
    for(let i=0;i<this.cartList.length;i++){
      if(this.cartList[i].product.sku_id === sku_id)
      { 
        if(this.cartList[i].quantity > 0){
          this.cartList[i].quantity = quantity;
          break;
        }
      }
    }
    this.setCart(this.cartList);
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

//cart structure in local storage
// cart:{
//   "email1":{"item sku":1,"item sku2":2},
//   "email2":{"item sku":4,"item sku2":5},
//   "untraced Items":{"item sku1":2,"item sku2":5}
// }
