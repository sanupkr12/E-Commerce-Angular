import { Component } from '@angular/core';
import { CartService } from '../cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  brand:string = "Apple";
  title:string = "Iphone";
  price:number = 60000;
  description:string = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis ullam eos debitis, rerum dolor fugit dolorem quia adipisci? Minus veritatis id odio vel pariatur ad optio assumenda quia, accusantium dolores.";

  constructor(private cartService:CartService){

  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
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
