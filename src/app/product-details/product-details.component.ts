import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
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

  constructor(private router:ActivatedRoute,private productService:ProductService,private cartService:CartService){

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

    this.cartService.initializeCart();
    this.cartService.validateCart();
  }

  changeDisplayImage(event:any){
    this.display_image = event.target.src;
  }
  
  addProduct(sku_id:string){
    this.cartService.addToCart(sku_id);
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
