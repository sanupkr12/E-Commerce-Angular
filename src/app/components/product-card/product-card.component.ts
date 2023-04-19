import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { cartInterface } from '../../Interface/cartInterface';
import {product as ProductInterface} from '../../Interface/productInterface';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  quantity:number = 0;
  @Input() product:ProductInterface = {} as ProductInterface;
  @Input() cart:cartInterface[] = [];
  @Output() removeItem:EventEmitter<any>= new EventEmitter();

  constructor(private cartService: CartService,private toastService:ToastService){

  }

  ngOnInit(){
    this.quantity = 0;
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id === this.product.sku_id){
        this.quantity = this.cart[i].quantity;
        break;
      }
    }
    this.cartService.getCart().subscribe((data:cartInterface[])=>{
      this.cart = data;
      this.quantity = 0;
      for(let i=0;i<this.cart.length;i++){
        if(this.cart[i].product.sku_id === this.product.sku_id){
          this.quantity = this.cart[i].quantity;
          break;
        }
      }
    })
  }

  addProduct(sku_id:string){
    this.toastService.setToast({status:'success',message:"Product added successfully"})
    this.quantity = 1;
    this.cartService.addToCart(sku_id);
    this.cart.push({product:this.product,quantity:this.quantity});
  }

  increaseQuantity(sku_id:string){
    this.quantity+=1;
    this.toastService.setToast({status:'success',message:"Quantity updated successfully"});
    this.cartService.increaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart([...this.cart]);
        break;
      }
    }
  }

  decreaseQuantity(sku_id:string){
    if(this.quantity<=0){
      this.toastService.setToast({status:'error',message:"Invalid quantity"});
      return;
    }
    
    // this.cartService.decreaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        if(this.cart[i].quantity===1){
          this.removeItem.emit({sku_id:this.cart[i].product.sku_id,title:this.cart[i].product.title});
          return;
        }
        this.toastService.setToast({status:'success',message:"Quantity updated successfully"});
        this.cartService.decreaseQuantity(sku_id);
        break;
      }
    }
  }

  updateQuantity(sku_id:string,event:any){
    if(event.target.value==="")
    {
      this.removeItem.emit({sku_id,title:this.product.title});
      return;
    }
    if(isNaN(event.target.value))
    {
      this.toastService.setToast({status:'error',message:"Invalid quantity"});
      return;
    }
    if(parseInt(event.target.value))
    {
      this.toastService.setToast({status:'error',message:"Invalid quantity"});
      return;
    }
    this.quantity = parseInt(event.target.value);
    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        break;
      }
    }
    this.cartService.setCart(this.cart);
  }

  reinitializeQuantity(event:any){
    event.target.value = this.quantity;
  }

}
