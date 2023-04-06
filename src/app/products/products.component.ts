import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { product } from '../Interface/productInterface';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products:product[] = [];
  constructor(private productService: ProductService){

  }

  ngOnInit(){
      this.productService.getProducts().subscribe((products:any)=>{
          this.products = products['products'];
      })
  }

  brand:string = "Apple";
  title:string = "Iphone";
  price:number = 60000;
  description:string = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis ullam eos debitis, rerum dolor fugit dolorem quia adipisci? Minus veritatis id odio vel pariatur ad optio assumenda quia, accusantium dolores.";


}
