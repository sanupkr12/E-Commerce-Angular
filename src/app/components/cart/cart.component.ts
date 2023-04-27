import { Component,ElementRef,ViewChild } from '@angular/core';
import { CartService } from '../../common/services/cart.service';
import { cartInterface as CartInterface } from '../../common/interfaces/cart.types';
import { ToastService } from '../../common/services/toast.service';
import { Papa as papaParse } from 'ngx-papaparse';
declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  public cartItems:CartInterface[]=[];
  public totalMrp:number = 0;
  public error_message:string = "";
  public success_message:string = "";
  public to_delete_title:string = "";
  public placedOrder:boolean = false;
  public removeModal:any;
  private _to_delete_sku:string = "";

  @ViewChild('removeModal') private removeModalEl!:ElementRef;

  constructor(private cartService:CartService,private toastService:ToastService,private papa:papaParse){
  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.updateMrp();
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
      this.updateMrp();
    }) 
  }

  ngAfterViewInit(){
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    //     var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new bootstrap.Tooltip(tooltipTriggerEl)
    // }) 
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
    this.handleSuccessToast("Quantity updated successfully");
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
