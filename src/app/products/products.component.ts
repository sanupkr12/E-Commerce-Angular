import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { product } from '../Interface/productInterface';
import { CartService } from '../cart.service';
import { cartInterface } from '../Interface/cartInterface';
import { ActivatedRoute } from '@angular/router';
import { priceInterface } from '../Interface/priceInterface';
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
  brands:string[]=[];
  ratingFilter:number=0;
  priceFilter:priceInterface = {} as priceInterface;
  brandFilters:string[] = [];
  constructor(private productService: ProductService,private cartService:CartService,private router:ActivatedRoute){

  }

  ngOnInit(){
    this.products = this.cartService.productList;
    this.router.queryParams.subscribe((params)=>{
      if(params.hasOwnProperty('search')){
        this.search = true;
        this.searchProducts = this.addSearchFilter(this.products,params['search']);
      }
      else{
        this.search = false;
      }
    });
    this.productService.getProducts().subscribe((products:any)=>{
        this.products = products['products'];
        this.products.map((product)=>{
          this.brands.push(product.brand);
        })
        this.brands = [...new Set(this.brands)];
    })
    this.products = this.productService.productList;
    this.brands = this.productService.brands;
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartItems = this.cartService.cartList;
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
    });
    this.ratingFilter = this.cartService.rating;
    this.cartService.getRatingFilter().subscribe((rating)=>{
      this.ratingFilter = rating;
    })
    this.priceFilter = this.cartService.price;
    this.cartService.getPriceFilter().subscribe((price:priceInterface)=>{
      this.priceFilter = price;
    });
    this.brandFilters = [...this.cartService.brands];
    this.cartService.getBrandFilter().subscribe((res)=>{
      this.brandFilters = [...res];
    })
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

  addBrandFilter(event:any){
    if(event.target.checked){
      if(this.brandFilters.indexOf(event.target.value.toLowerCase().trim())===-1){
        this.brandFilters.push(event.target.value.toLowerCase().trim());
      }
    }
    else{
      this.brandFilters = this.brandFilters.filter((brand)=>brand!=event.target.value.toLowerCase())
    }
    this.cartService.setBrandFilter(this.brandFilters);
  }

  addRatingFilter(event:any){
    this.cartService.setRatingFilter(parseInt(event.target.value));
  }

  handleSort(event:any){
    if(!this.search){
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
    else{
      switch(event.target.value){
        case "rel":
          break;
        case "plth":
          this.searchProducts = this.searchProducts.sort(this.sortplth);
          break;
        case "phtl":
          this.searchProducts = this.searchProducts.sort(this.sortphtl);
          break;
        case "rhtl":
          this.searchProducts = this.searchProducts.sort(this.sortrhtl);
          break;
        default:
      }
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

  handleMinPrice(event:any){
    this.priceFilter = {min:parseInt(event.target.value),max:this.priceFilter.max};
    this.cartService.setPriceFilter(this.priceFilter);
  }

  handleMaxPrice(event:any){
    this.priceFilter = {min:this.priceFilter.min,max:parseInt(event.target.value)};
    this.cartService.setPriceFilter(this.priceFilter);
  }

  isValidBrand(item:string){
    if(this.brandFilters.length>0){
      if(this.brandFilters.indexOf(item.toLowerCase())===-1){
        return false;
      }
      else{
        return true;
      }
    }else{
      return true;
    }
  }
  
}
