import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserInterface } from '../Interface/userInterface';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import {product as ProductInterface} from "../Interface/productInterface";
import { cartInterface as CartInterface } from '../Interface/cartInterface';
import { BehaviorSubject, Subject } from 'rxjs';
import { priceInterface } from '../Interface/priceInterface';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cartItems = new BehaviorSubject<CartInterface[]>([]);
  userList:UserInterface[] = [];
  productList:ProductInterface[] = [];
  cartList:CartInterface[] = [];

  constructor(private authService:AuthService,private userService:UserService,private productService:ProductService) { }
  ngOnInit(){
    this.productService.getProducts().subscribe((data:any)=>{
      this.productList = data.products;
    })
  }

  setCart(res:CartInterface[]){
    this._cartItems.next([...res]);
    this.cartList = [...res];
  }

  getCart(){
    return this._cartItems.asObservable();
  }

  setFilter(filter:{})
  {
    sessionStorage.setItem('filter',JSON.stringify(filter));
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
    this.cartList.push({'product':product,'quantity':1});
    localStorage.setItem('cart',JSON.stringify(cart));
    this.setCart([...this.cartList]);
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
    this.setCart([...this.cartList]);
  }

  decreaseQuantity(sku_id:string){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}));
      }
      else{
        cart[email][sku_id]-=1;
        if(cart[email][sku_id]<=0)
        {
          delete cart[email][sku_id];
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
    this.setCart([...this.cartList]);
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
    this.setCart([...this.cartList]);
  }

  removeItem(sku_id:string){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    this.cartList = this.cartList.filter((item)=>item.product.sku_id!=sku_id);
    this.setCart([...this.cartList]);
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}));
      }
      else{
        delete cart[email][sku_id];
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
    else{
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{}}));
      }
      else{
        delete cart['untracked'][sku_id];
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
  }
  clearCart(){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    this.cartList = [];
    this.setCart([...this.cartList]);
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}));
      }
      else{
        cart[email] = {};
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
    else{
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{}}));
      }
      else{
        cart['untracked'] = {};
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
  }

  addItem(sku_id:string,quantity:number){
    const email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(email!=null){
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({[email]:{[sku_id]:quantity<=0?0:quantity},'untracked':{}}));
      }
      else{
        if(sku_id in cart[email]){
          cart[email][sku_id] += quantity<=0 ? 0:quantity;
        }
        else{
          cart[email][sku_id] = quantity<=0 ? 0:quantity;
        }
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
    else{
      if(!cart){
        localStorage.setItem('cart',JSON.stringify({'untracked':{[sku_id]:quantity<=0?0:quantity}}));
      }
      else{
        if(sku_id in cart['untracked']){
          cart['untracked'][sku_id] += quantity<=0?0:quantity;
        }
        else{
          cart['untracked'][sku_id] = quantity<=0?0:quantity;
        }
        localStorage.setItem('cart',JSON.stringify(cart));
      }
    }
    let isPresent = false;
    for(let i=0;i<this.cartList.length;i++){
      if(this.cartList[i].product.sku_id === sku_id)
      { 
        if(this.cartList[i].quantity > 0){
          this.cartList[i].quantity += quantity;
          isPresent = true;
          break;
        }
      }
    }
    
    if(isPresent===false){
      let product:ProductInterface = {} as ProductInterface;
      for(let i=0;i<this.productList.length;i++){
        if(this.productList[i].sku_id === sku_id){
          product = this.productList[i];
          break;
        }
      }
      this.cartList.push({'product':product,'quantity':quantity});
      this.setCart([...this.cartList]);
    }
    else{
      console.log(isPresent);
      this.setCart([...this.cartList]);
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
        if(!(email in cartObj))
        {
          if(email!="")
          {
            localStorage.setItem('cart',JSON.stringify({[email]:{...cartObj['untracked']},'untracked':{}}));
          }
          else{
            localStorage.removeItem('email');
          } 
        }
        else{
          cartObj[email] = {...cartObj[email],...cartObj['untracked']};
          cartObj['untracked'] = {};
          localStorage.setItem('cart',JSON.stringify(cartObj));
        }
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
            console.log(isValidUser);
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
          this.setCart(res);
          
        }
      }
      else{
        if(!cart){
          localStorage.setItem('cart',JSON.stringify({[email]:{},'untracked':{}}))
        }
        else{
          //do somthing with currently logged in user
          console.log(email);
          if(!(email in cart)){
            let res:CartInterface[]= [];
            for(let key in cart['untracked']){
              let quantity:number = cart['untracked'][key];
              for(let i=0;i<productList.length;i++){
                if(productList[i].sku_id === key){
                  res.push({product:{...productList[i]},'quantity':quantity});
                  break;
                }
              }
            }
            localStorage.setItem('cart',JSON.stringify({[email]:{...cart['untracked']},'untracked':{}}));
            this.setCart([...res]);
          }
          else{
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
            console.log(res);
            this.setCart([...res]);
          }
        }
      }
    })
  }
  
  initializeSessionStorage(){
    try{
      let filter = JSON.parse(sessionStorage.getItem('filter') || '');
      if(!filter){
        sessionStorage.setItem('filter',JSON.stringify({minPrice:0,maxPrice:10000000,rating:0,brands:[]}));
      } 
    }catch(err){
      sessionStorage.setItem('filter',JSON.stringify({minPrice:0,maxPrice:10000000,rating:0,brands:[]}));
    }
    
  }

  getFilter(){
    try{
      let filterObj = JSON.parse(sessionStorage.getItem('filter') || '');
      if(!filterObj){
        return {minPrice:0,maxPrice:10000000,rating:0,brands:[]};
      }
      else{
        return filterObj;
      }
    }
    catch(err){
      return {minPrice:0,maxPrice:10000000,rating:0,brands:[]};
    }
  }
}

//cart structure in local storage
// cart:{
//   "email1":{"item sku":1,"item sku2":2},
//   "email2":{"item sku":4,"item sku2":5},
//   "untracked Items":{"item sku1":2,"item sku2":5}
// }

//Session Storage structure
//filter:{minPrice:0,maxPrice:1000000},
//        rating:number,
//        brand:string[]}
