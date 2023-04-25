import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { product } from '../../Interface/productInterface';
import { CartService } from '../../services/cart.service';
import { cartInterface } from '../../Interface/cartInterface';
import { ActivatedRoute } from '@angular/router';
import { priceInterface } from '../../Interface/priceInterface';
import { ToastService } from '../../services/toast.service';
declare var bootstrap:any;
// import { Toast } from "bootstrap";
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
  success_message:string = "";
  error_message:string = "";
  private _to_delete_sku:string="";
  to_delete_title:string="";
  removeModal:any;
  filter = {
    minPrice:0,
    maxPrice:1000000,
    rating:0,
    brands:[] as string[]
  }
  constructor(private productService: ProductService,private cartService:CartService,private router:ActivatedRoute,private toastService:ToastService){

  }
  @ViewChild('removeModal') removeModalEl!:ElementRef;
  ngOnInit(){
    this.products = this.cartService.productList;
    this.productService.getProducts().subscribe((products:any)=>{
        this.products = products['products'];
        this.products.map((product)=>{
          this.brands.push(product.brand);
        })
        this.brands = [...new Set(this.brands)];
    })
    this.router.queryParams.subscribe((params)=>{
      if(params.hasOwnProperty('search')){
        this.search = true;
        this.filter = {
          minPrice:0,
          maxPrice:1000000,
          rating:0,
          brands:[]
        }
        this.cartService.setFilter(this.filter);
        this.searchProducts = this.addSearchFilter(this.products,params['search']);
      }
      else{
        this.search = false;
      }
    });
    this.brands = this.productService.brands;
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
    });

    this.filter = this.cartService.getFilter();
  }

  ngAfterViewInit() {
    this.removeModal = new bootstrap.Modal(this.removeModalEl.nativeElement);
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
  removeBrandFilter(brand:string){
    if(this.filter.brands.indexOf(brand)>-1)
    {
      this.filter.brands = this.filter.brands.filter((item)=>item!=brand);
    }
    this.cartService.setFilter(this.filter);
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

  removeItem(event:any){
    this._to_delete_sku = event.sku_id;
    this.to_delete_title = event.title;
    this.removeModal.show();
  }

  deleteItem(){
    this.cartService.removeItem(this._to_delete_sku);
    this.toastService.setToast({status:'success',message:'Item deleted successfully'});
  }

  resetFilter(){
    this.filter = {
      minPrice:0,
      maxPrice:1000000,
      rating:0,
      brands:[]
    }
    this.cartService.setFilter(this.filter);
  }

  updateQuantity(sku_id:string,event:any){
    if(isNaN(event.target.value)){
      this.handleErrorToast("Not a valid number");
      return;
    }
    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
  }

  addBrandFilter(event:any){
    if(event.target.checked){
      if(this.filter.brands.indexOf(event.target.value.toLowerCase().trim())===-1){
        this.filter.brands.push(event.target.value.toLowerCase().trim());
      }
    }
    else{
      this.filter.brands = this.filter.brands.filter((brand)=>brand!=event.target.value.toLowerCase());
    }
    this.cartService.setFilter(this.filter);
  }

  addRatingFilter(event:any){
    this.filter.rating = parseInt(event.target.value);
    this.cartService.setFilter(this.filter);
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
    let value = event.target.value;
    if(isNaN(value)){
      event.target.value = this.filter.minPrice;
      this.handleErrorToast("Not a valid number");
      return;
    }
    if(parseInt(value)>this.filter.maxPrice){
      this.handleErrorToast("min price must be less than max price");
      event.target.value = this.filter.minPrice;
      return;
    }
    this.filter.minPrice = parseInt(value);
    this.cartService.setFilter(this.filter);
  }

  handleMaxPrice(event:any){
    let value = event.target.value;
    if(isNaN(value)){
      event.target.value = this.filter.maxPrice;
      this.handleErrorToast("Not a valid number");
      return;
    }
    if(this.filter.minPrice>parseInt(value)){
      event.target.value= this.filter.maxPrice;
      this.handleErrorToast("min price must be less than max price");
      return;
    }
    this.filter.maxPrice = parseInt(value);
    this.cartService.setFilter(this.filter);
  }

  isValidBrand(item:string){
    if(this.filter.brands.length>0){
      if(this.filter.brands.indexOf(item.toLowerCase())===-1){
        return false;
      }
      else{
        return true;
      }
    }else{
      return true;
    }
  }

  handleErrorToast(event:any){
    this.error_message = event;
    this.toastService.setToast({status:'error',message:event});
  }

  handleSucessToast(event:any){
    this.success_message = event;
    this.toastService.setToast({status:'success',message:event});
  }
  
}
