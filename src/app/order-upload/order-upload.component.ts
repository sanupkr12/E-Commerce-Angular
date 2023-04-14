import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../cart.service';
import { Papa,ParseResult } from 'ngx-papaparse';
import { Observable } from 'rxjs';
import { orderData } from '../Interface/orderData';
import { cartInterface } from '../Interface/cartInterface';
import { product } from '../Interface/productInterface';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-order-upload',
  templateUrl: './order-upload.component.html',
  styleUrls: ['./order-upload.component.css']
})
export class OrderUploadComponent {
  orders:cartInterface[]=[];
  cartItems:cartInterface[]=[];
  previewItems:boolean = false;
  productList:product[] = [];
  constructor(private cartService:CartService,private papa:Papa,private productService:ProductService){

  }
  
  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
    this.cartItems = this.cartService.cartList;
    this.productService.getProducts().subscribe((data:any)=>{
      this.productList = data.products;
    })
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
    })
  }

  handleFileUpload(event:any){
    this.previewItems = false;
    let file = event.target.files[0];
    this.parseTsv(file).subscribe((result:any)=>{
      // this.orders = result.data;
      for(let i=0;i<result.data.length;i++){
        for(let j=0;j<this.productList.length;j++){
          if(result.data[i].sku_id === this.productList[j].sku_id){
            this.orders.push({'product':this.productList[j],'quantity':parseInt(result.data[i].quantity)});
            break;
          }
        }
      }
    });
  }

  previewOrder(){
    if(this.orders.length<=0){
      alert("Nothing to show");
      this.previewItems = false;
      return;
    }
    this.previewItems = true;
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

  uploadOrder(){
    this.orders.map((order)=>{
      this.cartService.addItem(order.product.sku_id,order.quantity);
    })
    this.previewItems = false;
    alert("Order Added Successfully");
  }

  decreaseQuantity(sku_id:string){
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].product.sku_id===sku_id){
        if(this.orders[i].quantity>0){
          this.orders[i].quantity -=1;
          if(this.orders[i].quantity===0){
            delete this.orders[i];
          }
        }
      }
    }
  }

  increaseQuantity(sku_id:string){
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].product.sku_id===sku_id){
          this.orders[i].quantity+=1;
      }
    }
  }

  updateQuantity(sku_id:string,event:any){
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].product.sku_id===sku_id){
        if(event.target.value.isNan()){
          alert("Invalid quantity");
          return;
        }
        else{
          if(parseInt(event.target.value)>0){
            this.orders[i].quantity = parseInt(event.target.value);
          }
        }
      }
    }
  }

}