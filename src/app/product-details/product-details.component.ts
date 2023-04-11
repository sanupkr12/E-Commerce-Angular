import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { cartInterface } from '../Interface/cartInterface';
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
  cart:cartInterface[] = [];
  quantity:number = 0;
  constructor(private router:ActivatedRoute,private productService:ProductService,private cartService:CartService){

  }

  ngOnInit(){
    this.router.params.subscribe(params =>{
        this.sku_id = params['sku_id'];
    });
    this.cart = this.cartService.cartList;
    this.cartService.getCart().subscribe((res)=>{
      this.cart = [...res];
    })
    this.productService.getProducts().subscribe((products:any)=>{
        products['products'].map((item:Product)=>{
          if(item.sku_id === this.sku_id){
            this.product = item;
            this.display_image = item.thumbnail;
            for(let i=0;i<this.cart.length;i++){
              if(this.cart[i].product.sku_id===this.sku_id){
                this.quantity = this.cart[i].quantity;
              }
            }
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
    this.quantity = 1;
    this.cartService.addToCart(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
  }

  increaseQuantity(sku_id:string){
    this.quantity+=1;
    this.cartService.increaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
  }

  decreaseQuantity(sku_id:string){
    this.quantity-=1;
    this.cartService.decreaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
  }

  updateQuantity(sku_id:string,event:any){
    this.quantity = parseInt(event.target.value);
    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
  }
}
