import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../common/services/cart.service';
import { cartInterface } from '../../common/interfaces/cart.types';
import { ProductInterface } from '../../common/interfaces/product.types';
import { ProductService } from '../../common/services/product.service';
import { ToastService } from '../../common/services/toast.service';
declare var bootstrap :any;
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  public sku_id:string="";
  public product:ProductInterface = {} as ProductInterface;
  public display_image:string="";
  public cart:cartInterface[] = [];
  public quantity:number = 0;
  public success_message:string = "";
  public error_message:string = "";
  public removeModal:any;

  @ViewChild('removeModal') private removeModalEl!:ElementRef;

  constructor(private router:ActivatedRoute,private navigationRouter:Router,private productService:ProductService,private cartService:CartService,private toastService:ToastService){

  }

  ngOnInit(){

    this.router.params.subscribe(params =>{
        this.sku_id = params['sku_id'];
    });
    this.cartService.getCart().subscribe((res:cartInterface[])=>{
      this.cart = [...res];
      for(let i=0;i<res.length;i++){
        if(res[i].product.sku_id===this.sku_id){
          this.quantity = res[i].quantity;
        }
      }
    })
    this.productService.getProducts().subscribe((products:any)=>{
      let isValidSku = false;
        products['products'].map((item:ProductInterface)=>{
          if(item.sku_id === this.sku_id){
            this.product = item;
            isValidSku = true;
            this.display_image = item.thumbnail;
            for(let i=0;i<this.cart.length;i++){
              if(this.cart[i].product.sku_id===this.sku_id){
                this.quantity = this.cart[i].quantity;
              }
            }
          }
        });
        if(!isValidSku){
          this.navigationRouter.navigate(['/not-found']);
        }
    });
    this.cartService.initializeCart();
    this.cartService.validateCart();
  }

  ngAfterViewInit() {
    this.removeModal = new bootstrap.Modal(this.removeModalEl.nativeElement);
  }

  changeDisplayImage(event:any){
    this.display_image = event.target.src;
  }
  
  addProduct(sku_id:string){
    this.quantity = 1;
    this.cartService.addToCart(sku_id);
    this.handleSucessToast("Product added successfully");
  }

  increaseQuantity(sku_id:string){
    this.quantity+=1;
    this.cartService.increaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart([...this.cart]);
        break;
      }
    }
    this.handleSucessToast("Quantity updated successfully");
  }

  decreaseQuantity(sku_id:string){
    if(this.quantity<=0){
      this.handleErrorToast("Invalid quantity");
      return;
    }
    if(this.quantity===1){
      this.removeModal?.show();
      return;
    }
    this.quantity-=1;
    this.cartService.decreaseQuantity(sku_id);
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        if(this.cart[i].quantity<=0){
          delete this.cart[i];
        }
        else{
          this.cart[i].quantity = this.quantity;
        }
        this.cartService.setCart(this.cart);
        break;
      }
    }
    this.handleSucessToast("Quantity updated successfully");
  }

  removeItem(){
    this.quantity-=1;
    this.removeModal?.hide();
    this.handleSucessToast("Item removed successfully");
    this.cartService.removeItem(this.sku_id);
  }

  updateQuantity(sku_id:string,event:any){
    if(event.target.value === "")
    {
      this.removeModal.show();
      return;
    }
    if(isNaN(event.target.value)){
      this.handleErrorToast("Invalid quantity");
      return;
    }
    if(parseInt(event.target.value)<=0){
      if(parseInt(event.target.value)===0)
      {
        this.removeModal.show();
        return;
      }
      this.handleErrorToast("Invalid quantity");
      return;
    }
    this.quantity = parseInt(event.target.value);
    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].product.sku_id===sku_id){
        this.cart[i].quantity = this.quantity;
        this.cartService.setCart(this.cart);
        break;
      }
    }
    this.handleSucessToast("Quantity updated successfully");
  }

  reinitializeQuantity(event:any){
    event.target.value = this.quantity;
  }

  handleErrorToast(msg:string){
    this.error_message = msg;
    this.toastService.setToast({status:'error',message:msg});
  }

  handleSucessToast(msg:string){
    this.success_message = msg;
    this.toastService.setToast({status:'success',message:msg});
  }
}
