import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../../common/services/cart.service';
import { Papa as papaParse,ParseResult } from 'ngx-papaparse';
import { Observable } from 'rxjs';
import { OrderDataInterface } from '../../common/interfaces/order-data.types';
import { cartInterface } from '../../common/interfaces/cart.types';
import { ProductInterface } from '../../common/interfaces/product.types';
import { ProductService } from '../../common/services/product.service';
// import { Toast } from 'bootstrap';
import { ErrorOrderInterface } from '../../common/interfaces/error-order.types';
import { DownloadOrderInterface } from '../../common/interfaces/download-order.types';
import { ArrayData } from 'ngx-papaparse/lib/interfaces/unparse-data';
import { ToastService } from 'src/app/common/services/toast.service';
declare global {
  interface Navigator {
      msSaveBlob?: (blob: any, defaultName?: string) => string
  }
}
@Component({
  selector: 'app-order-upload',
  templateUrl: './order-upload.component.html',
  styleUrls: ['./order-upload.component.scss']
})
export class OrderUploadComponent {
  public orders:cartInterface[]=[];
  public cartItems:cartInterface[]=[];
  public previewItems:boolean = false;
  public productList:ProductInterface[] = [];
  public error_message:string = "";
  public success_message:string = "";
  public fileResult:any;
  public errorList:ErrorOrderInterface[] = [];
  public errorPreview:boolean = false;

  @ViewChild('orderFile',{static:true}) private orderFileEl!:ElementRef;

  constructor(private cartService:CartService,private papa:papaParse,private productService:ProductService,private toastService:ToastService){

  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.productService.getProducts().subscribe((data:any)=>{
      this.productList = data.products;
    })
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
    })
  }

  handleFileUpload(event:any){
    this.previewItems = false;
    this.errorPreview = false;
    let file = event.target.files[0];
    if(file.type!='text/tab-separated-values'){
      this.handleErrorToast("Invalid file type");
      return;
    }
    this.orders = [];
    this.parseTsv(file).subscribe((result:any)=>{
      // this.orders = result.data;
      this.fileResult = result;
      this.errorList = [];
      if(this.fileResult.meta.fields.indexOf('sku_id')>-1 && this.fileResult.meta.fields.indexOf('quantity')>-1){
        let map = new Map();
        for(let i=0;i<this.fileResult.data.length;i++){
          let quantity = this.fileResult.data[i].quantity;
          if(isNaN(quantity)){
            this.errorList.push({row:i+1,error:'Invalid quantity: Quantity must be a number'});
          }
          else{
            if(parseInt(quantity)<=0){
              this.errorList.push({row:i+1,error:'Invalid quantity:Quantity must be greater than 0'});
            }
            else{
              let isValidSKU = false;
              for(let j=0;j<this.productList.length;j++){
                if(this.fileResult.data[i].sku_id === this.productList[j].sku_id){
                  isValidSKU = true;
                  let ind = map.get(this.fileResult.data[i].sku_id);
                  if(!ind)
                  {
                    this.orders.push({'product':this.productList[j],'quantity':parseInt(this.fileResult.data[i].quantity)});
                    map.set(this.fileResult.data[i].sku_id, this.orders.length-1);
                  }
                  else{
                    this.orders[ind].quantity+=parseInt(this.fileResult.data[i].quantity);
                  }
                  break;
                }
              }
              if(!isValidSKU){
                this.errorList.push({'row':i+1,'error':'Invalid SKU :' + this.fileResult.data[i].sku_id});
              }
            }
          }
        }
      }
      else{
        this.handleErrorToast("Invalid headers");
      }
    });
  }

  previewOrder(){
    this.orderFileEl.nativeElement.value=null;
    if(this.errorList.length>0){
      this.previewItems = false;
      this.errorPreview = true;
      return;
    }
    if(this.orders.length<=0){
      this.handleErrorToast("Nothing to show");
      this.previewItems = false;
      return;
    }
    else{
      this.errorPreview = false;
      this.previewItems = true;
    }
  }

  parseTsv(file: File): Observable<ParseResult<any>> {
    return new Observable(observable => {
        this.papa.parse(file, {
          header: true,
          delimiter: "\t",
          skipEmptyLines:true,
            complete: (results) => {
                observable.next(results);
                observable.complete();
            }
        });
    });
  }

  placeOrder(){
    let config = {
      quoteChar : '$',
      header:true,
      delimiter : '\t'
    }
    let order:any = [];
    for(let i=0;i<this.orders.length;i++){
      let fields = {} as any;
      fields['sku_id'] = this.orders[i].product.sku_id;
      fields['quantity'] = this.orders[i].quantity;
      fields['price'] = this.orders[i].product.price;
      fields['title'] = this.orders[i].product.title;
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
    this.handleSucessToast("Order placed successfully");
    this.orders = [];
    this.previewItems = false;
    this.errorPreview = false;
  }

  uploadOrder(){
    this.orders.map((order)=>{
      this.cartService.addItem(order.product.sku_id,order.quantity);
    })
    this.previewItems = false;
    this.handleSucessToast("Order Added Successfully");
  }

  decreaseQuantity(sku_id:string){
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].product.sku_id===sku_id){
        if(this.orders[i].quantity<=0){
          this.handleErrorToast("Invalid quantity");
          return;
        }
        if(this.orders[i].quantity>0){
          this.orders[i].quantity -=1;
          if(this.orders[i].quantity===0){
            delete this.orders[i];
          }
        }
        this.handleSucessToast("Quantity updated successfully");
      }
    }
  }

  increaseQuantity(sku_id:string){
    this.handleSucessToast("Quantity updated successfully");
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].product.sku_id===sku_id){
          this.orders[i].quantity+=1;
      }
    }
  }

  updateQuantity(sku_id:string,event:any){
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].product.sku_id===sku_id){
        if(event.target.value.isNan() || parseInt(event.target.value)<=0){
          if(event.target.value.isNan())
          {
            event.target.value = this.orders[i].quantity;
            this.handleErrorToast("Invalid quantity");
            return;
          }
          else if(event.target.value===0){
            this.orders = this.orders.filter((order)=>order.product.sku_id!=sku_id);
            return;
          }
          this.handleErrorToast("Invalid quantity");
          event.target.value = this.orders[i].quantity;
          return;
        }
        else{
          if(parseInt(event.target.value)>0){
            this.orders[i].quantity = parseInt(event.target.value);
            this.handleSucessToast("Quantity updated successfully");
            return;
          }
        }
      }
    }
  }

  handleErrorToast(msg:string){
    this.toastService.setToast({status: "error", message: msg});
  }

  handleSucessToast(msg:string){
    this.toastService.setToast({status: "success", message: msg});
  }
}