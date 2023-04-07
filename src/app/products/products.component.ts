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

  addProduct(sku_id:string,quantity:number){
    
  }

  increaseQuantity(sku_id:string,quantity:number){

  }

  decreaseQuantity(sku_id:string,quantity:number){
    
  }

}
