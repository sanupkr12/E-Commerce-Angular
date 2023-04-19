import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { cartInterface } from '../../Interface/cartInterface';
import { product as Product } from '../../Interface/productInterface';
import { ProductService } from '../../services/product.service';
import * as $ from 'jquery';
import { ToastService } from '../../services/toast.service';
// import {Toast,Modal} from "bootstrap";
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  sku_id:string="";
  product:Product = {} as Product;
  display_image:string="";
  cart:cartInterface[] = [];
  quantity:number = 0;
  success_message:string = "";
  error_message:string = "";
  constructor(private router:ActivatedRoute,private productService:ProductService,private cartService:CartService,private toastService:ToastService){

  }

  ngOnInit(){

    this.router.params.subscribe(params =>{
        this.sku_id = params['sku_id'];
    });
    this.cart = this.cartService.cartList;
    this.cartService.getCart().subscribe((res:cartInterface[])=>{
      this.cart = [...res];
      for(let i=0;i<res.length;i++){
        if(res[i].product.sku_id===this.sku_id){
          this.quantity = res[i].quantity;
        }
      }
    })
    this.productService.getProducts().subscribe((products:any)=>{
        products['products'].map((item:Product)=>{
          if(item.sku_id === this.sku_id){
            this.product = item;
            this.display_image = item.thumbnail;
            for(let i=0;i<this.cart.length;i++){
              if(this.cart[i].product.sku_id===this.sku_id){
                this.quantity = this.cart[i].quantity;
              }
            }
          }
        });
    });
    this.cartService.initializeCart();
    this.cartService.validateCart();
  }

  changeDisplayImage(event:any){
    this.display_image = event.target.src;
  }
  
  addProduct(sku_id:string){
    this.quantity = 1;
    this.cartService.addToCart(sku_id);
    this.handleSucessToast("Product added successfully");
    // this.quantity = 1;
    // // let isPresent = false;
    // // for(let i=0;i<this.cart.length;i++){
    // //   if(this.cart[i].product.sku_id===sku_id){
    // //     this.cart[i].quantity = this.quantity;
    // //     this.cartService.setCart([...this.cart]);
    // //     isPresent = true;
    // //     break;
    // //   }
    // // }
    // // if(!isPresent){
    // }
  }

  increaseQuantity(sku_id:string){
    this.quantity+=1;
    this.cartService.increaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart([...this.cart]);
        break;
      }
    }
    this.handleSucessToast("Quantity updated successfully");
  }

  decreaseQuantity(sku_id:string){
    if(this.quantity<=0){
      this.handleErrorToast("Invalid quantity");
      return;
    }
    if(this.quantity===1){
      // this.removeModal?.show();
      return;
    }
    this.quantity-=1;
    this.cartService.decreaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        if(this.cart[i].quantity<=0){
          delete this.cart[i];
        }
        else{
          this.cart[i].quantity = this.quantity;
        }
        this.cartService.setCart(this.cart);
        break;
      }
    }
    this.handleSucessToast("Quantity updated successfully");
  }

  removeItem(){
    this.quantity-=1;
    // this.removeModal?.hide();
    this.handleSucessToast("Item removed successfully");
    this.cartService.removeItem(this.sku_id);
    // this.cartService.decreaseQuantity(this.sku_id);
    // for(let i=0;i<this.cart.length;i++){
    //   if(this.cart[i].product.sku_id===this.sku_id){
    //     if(this.cart[i].quantity<=0){
    //       delete this.cart[i];
    //     }
    //   }
    // }
    // this.cartService.setCart([...this.cart]); 
  }

  updateQuantity(sku_id:string,event:any){
    if(isNaN(event.target.value)){
      this.handleErrorToast("Invalid quantity");
      return;
    }
    if(parseInt(event.target.value)<=0){
      this.handleErrorToast("Invalid quantity");
      return;
    }
    this.quantity = parseInt(event.target.value);
    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
    this.handleSucessToast("Quantity updated successfully");
  }

  handleErrorToast(msg:string){
    this.error_message = msg;
    this.toastService.setToast({status:'error',message:msg});
  }

  handleSucessToast(msg:string){
    this.success_message = msg;
    this.toastService.setToast({status:'success',message:msg});
  }
}
