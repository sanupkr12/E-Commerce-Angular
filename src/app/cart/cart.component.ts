import { Component } from '@angular/core';

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

  addProduct(sku_id:string,quantity:number){
    
  }

  increaseQuantity(sku_id:string,quantity:number){

  }

  decreaseQuantity(sku_id:string,quantity:number){
    
  }
}
