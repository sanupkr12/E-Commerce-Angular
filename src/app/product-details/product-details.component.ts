import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product as Product } from '../Interface/productInterface';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  sku_id:string="";
  product:Product = {} as Product;
  display_image:string="";

  constructor(private router:ActivatedRoute,private productService:ProductService){

  }

  ngOnInit(){
    this.router.params.subscribe(params =>{
        this.sku_id = params['sku_id'];
    });

    this.productService.getProducts().subscribe((products:any)=>{
        products['products'].map((item:Product)=>{
          if(item.sku_id === this.sku_id){
            this.product = item;
            this.display_image = item.thumbnail;
          }
        });
    });
  }

  changeDisplayImage(event:any){
    this.display_image = event.target.src;
  }

  brand:string = "Apple";
  title:string = "Iphone";
  price:number = 60000;
  description:string = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis ullam eos debitis, rerum dolor fugit dolorem quia adipisci? Minus veritatis id odio vel pariatur ad optio assumenda quia, accusantium dolores.";
}
