import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  brand:string = "Apple";
  title:string = "Iphone";
  price:number = 60000;
  description:string = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis ullam eos debitis, rerum dolor fugit dolorem quia adipisci? Minus veritatis id odio vel pariatur ad optio assumenda quia, accusantium dolores.";
  
}
