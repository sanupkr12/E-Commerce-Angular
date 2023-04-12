import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { product } from '../Interface/productInterface';
import { CartService } from '../cart.service';
import { cartInterface } from '../Interface/cartInterface';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products:product[] = [];
  cartItems:cartInterface[] = [];
  searchProducts:product[] = [];
  search:boolean = false;
  constructor(private productService: ProductService,private cartService:CartService,private router:ActivatedRoute){

  }

  ngOnInit(){
    this.router.queryParams.subscribe((params)=>{
      if(params.hasOwnProperty('search')){
        this.search = true;
        // this.products = this.addSearchFilter(this.products,params['search']);
        this.searchProducts = this.addSearchFilter(this.products,params['search']);
      }
      else{
        this.search = false;
      }
    });
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

  addSearchFilter(products:product[],query:string){
    if(query.length===0){
      return products;
    }
    query = query.toLowerCase();
    let resultProducts:product[] = [];
    for(let i=0;i<products.length;i++){
      if(products[i].title.toLowerCase().includes(query) || products[i].description.toLowerCase().includes(query) || products[i].brand.toLowerCase().includes(query))
      {
          resultProducts.push(products[i]);
      }
    }
    return resultProducts;
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

  handleSort(event:any){
    switch(event.target.value){
      case "rel":
        this.products = this.cartService.productList;
        break;
      case "plth":
        this.products = this.products.sort(this.sortplth);
        break;
      case "phtl":
        this.products = this.products.sort(this.sortphtl);
        break;
      case "rhtl":
        this.products = this.products.sort(this.sortrhtl);
        break;
      default:
    }
  }

  sortphtl(a:product,b:product){
    return a.price < b.price ? 1 : -1;
  }

  sortplth(a:product,b:product){
    return a.price > b.price ? 1 : -1;
  }

  sortrhtl(a:product,b:product){
    return a.rating < b.rating ? 1 : -1;
  }
}
