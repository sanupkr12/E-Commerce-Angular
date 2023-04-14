import { Component, Input, SimpleChanges } from '@angular/core';
import { CartService } from '../cart.service';
import { cartInterface } from '../Interface/cartInterface';
import {product as ProductInterface} from '../Interface/productInterface';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  quantity:number = 0;
  @Input() product:ProductInterface = {} as ProductInterface;
  @Input() cart:cartInterface[] = [];
  constructor(private cartService: CartService){

  }

  ngOnInit(){
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id === this.product.sku_id){
        this.quantity = this.cart[i].quantity;
        break;
      }
    }
  }

  addProduct(sku_id:string){
    this.quantity = 1;
    this.cartService.addToCart(sku_id);
    this.cart.push({product:this.product,quantity:this.quantity});
  }

  increaseQuantity(sku_id:string){
    this.quantity+=1;
    this.cartService.increaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
  }

  decreaseQuantity(sku_id:string){
    this.quantity-=1;
    this.cartService.decreaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
  }

  updateQuantity(sku_id:string,event:any){
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

}
