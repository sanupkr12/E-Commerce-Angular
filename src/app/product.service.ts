import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {product, product as ProductInterface} from "./Interface/productInterface"
import { shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  brands:string[] = [];
  productList:product[] = [];
  constructor(private http:HttpClient) { }

  ngOnInit(){
  }
  getProducts(){
    return this.http.get<ProductInterface[]>("../../assets/json/products.json").pipe(shareReplay(1));
  }

  // initializeProducts(){
  //   this.getProducts().subscribe((data:any)=>{
  //     this.productList = data.products;
  //     for(let i=0;i<this.productList.length;i++){
  //       this.brands.push(this.productList[i].brand);
  //     }
  //     this.brands = [...new Set(this.brands)];
  //   });
  // }
}
