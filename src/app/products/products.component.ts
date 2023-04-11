import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { product } from '../Interface/productInterface';
import { CartService } from '../cart.service';
import { cartInterface } from '../Interface/cartInterface';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products:product[] = [];
  cartItems:cartInterface[] = [];
  constructor(private productService: ProductService,private cartService:CartService){

  }

  ngOnInit(){
      this.productService.getProducts().subscribe((products:any)=>{
          this.products = products['products'];
      })
      this.cartService.initializeCart();
      this.cartService.validateCart();
      this.cartItems = this.cartService.cartList;
      this.cartService.getCart().subscribe((res)=>{
        this.cartItems = [...res];
      });
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
