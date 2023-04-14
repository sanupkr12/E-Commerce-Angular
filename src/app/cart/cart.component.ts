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
  totalMrp:number = 0;
  constructor(private cartService:CartService,private productService:ProductService){
  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartItems = this.cartService.cartList;
    this.updateMrp();
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
      this.totalMrp = 0;
      for(let i=0;i<this.cartItems.length;i++){
        this.totalMrp+=this.cartItems[i].product.price * this.cartItems[i].quantity;
      }
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

  updateMrp(){
    this.totalMrp = 0;
      for(let i=0;i<this.cartItems.length;i++){
        this.totalMrp+=this.cartItems[i].product.price * this.cartItems[i].quantity;
      }
  }

  removeItem(sku_id:string){
    this.cartService.removeItem(sku_id);
    setTimeout(()=>{this.updateMrp()},200);
  }

}
