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
  
  addProduct(sku_id:string,quantity:number){
    
  }

  increaseQuantity(sku_id:string,quantity:number){

  }

  decreaseQuantity(sku_id:string,quantity:number){

  }
}
