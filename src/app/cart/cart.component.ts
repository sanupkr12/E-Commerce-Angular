import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';
import { product as ProductInterface } from '../Interface/productInterface';
import { cartInterface as CartInterface } from '../Interface/cartInterface';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems:CartInterface[]=[];
  constructor(private cartService:CartService,private productService:ProductService){
  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartItems = this.cartService.cartList;
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = res;
    })
  }

  increaseQuantity(sku_id:string){
    this.cartService.increaseQuantity(sku_id);
  }

  decreaseQuantity(sku_id:string){
    this.cartService.decreaseQuantity(sku_id);
  }

  updateQuantity(sku_id:string,event:any){
    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
  }
}
