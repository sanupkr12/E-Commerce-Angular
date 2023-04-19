import { Component,ElementRef,ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { product as ProductInterface } from '../../Interface/productInterface';
import { cartInterface as CartInterface } from '../../Interface/cartInterface';
import { ToastService } from '../../services/toast.service';
import { Papa } from 'ngx-papaparse';
declare var bootstrap: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems:CartInterface[]=[];
  totalMrp:number = 0;
  error_message:string = "";
  success_message:string = "";
  private _to_delete_sku:string = "";
  to_delete_title:string = "";
  placedOrder:boolean = false;
  removeModal:any;
  @ViewChild('removeModal') removeModalEl!:ElementRef;
  constructor(private cartService:CartService,private productService:ProductService,private toastService:ToastService,private papa:Papa){
  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartItems = this.cartService.cartList;
    this.updateMrp();
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
      this.updateMrp();
    })
  }
  ngAfterViewInit(){
    this.removeModal = new bootstrap.Modal(this.removeModalEl.nativeElement);
  }


  increaseQuantity(sku_id:string){
    this.cartService.increaseQuantity(sku_id);
    this.handleSuccessToast("Quantity updated successfully");
  }

  decreaseQuantity(sku_id:string){
    for(let i=0;i<this.cartItems.length;i++){
      if(this.cartItems[i].product.sku_id===sku_id){
        if(this.cartItems[i].quantity<=0){
          this.handleErrorToast("Invalid quantity");
          return;
        }
        else if(this.cartItems[i].quantity===1){
          this._to_delete_sku = sku_id;
          this.to_delete_title = this.cartItems[i].product.title;
          this.removeModal.show();
          return;
        }
        else{
          break;
        }
      }
    }
    this.cartService.decreaseQuantity(sku_id);
    this.handleSuccessToast("Quantity updated successfully");
  }

  updateQuantity(sku_id:string,event:any){
    if(event.target.value===""){
      this.deleteItem(sku_id);
      return;
    }
    if(isNaN(event.target.value)){
      this.handleErrorToast("Not a valid number");
      return;
    }
    
    if(parseInt(event.target.value)<=0){
      if(parseInt(event.target.value)===0)
      {
        this.deleteItem(sku_id);
        return;
      }
      this.handleErrorToast("Invalid quantity");
      return;
    }

    this.cartService.updateQuantity(sku_id,parseInt(event.target.value));
  }

  updateMrp(){
    this.totalMrp = 0;
      for(let i=0;i<this.cartItems.length;i++){
        this.totalMrp+=this.cartItems[i].product.price * this.cartItems[i].quantity;
      }
  }

  deleteItem(sku_id:string){
    this.removeModal.show();
    this._to_delete_sku = sku_id;
    for(let i=0;i<this.cartItems.length;i++){
      if(this.cartItems[i].product.sku_id===sku_id){
        this.to_delete_title = this.cartItems[i].product.title;
      }
    }
  }

  removeItem(){
    this.removeModal.hide();
    this.handleSuccessToast("Item removed successfully");
    this.cartService.removeItem(this._to_delete_sku);
  }

  clearCart(){
    this.cartService.clearCart();
  }

  handleErrorToast(msg:string){
    this.error_message = msg;
    this.toastService.setToast({status:'error',message:msg});
  }

  handleSuccessToast(msg:string){
    this.success_message = msg;
    this.toastService.setToast({status:'success',message:msg});
  }

  placeOrder(){
    let config = {
      quoteChar : '$',
      header:true,
      delimiter : '\t'
    }
    let order:any = [];
    for(let i=0;i<this.cartItems.length;i++){
      let fields = {} as any;
      fields['sku_id'] = this.cartItems[i].product.sku_id;
      fields['quantity'] = this.cartItems[i].quantity;
      fields['price'] = this.cartItems[i].product.price;
      fields['title'] = this.cartItems[i].product.title;
      order.push(fields);
    }
    let data = this.papa.unparse(order, config);
    // let order:downloadOrder[] = [];
    // for(let i=0;i<this.orders.length;i++){
    //   let fields:downloadOrder = {sku_id:this.orders[i].product.sku_id,quantity:this.orders[i].quantity,title:this.orders[i].product.title,price:this.orders[i].product.price};
    //   order.push(fields);
    // }
    // let data = this.papa.unparse(order, config);
    let blob = new Blob([data], {type: 'text/tsv;charset=utf-8'});
    let fileUrl = null;
    if (navigator.msSaveBlob) {
        fileUrl = navigator.msSaveBlob(blob, 'download.tsv');
    } else {
        fileUrl = window.URL.createObjectURL(blob);
    }
    let ele = document.createElement('a');
    ele.href=fileUrl;
    ele.setAttribute('download', 'download.tsv');
    ele.click();
    ele.remove();
    this.cartService.clearCart();
    this.placedOrder = true;
  }

  reinitializeQuantity(sku_id:string,event:any){
    for(let i=0;i<this.cartItems.length;i++){
      if(this.cartItems[i].product.sku_id===sku_id){
        event.target.value = this.cartItems[i].quantity;
        return;
      }
    }
  }
}
