import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ProductInterface} from "../interfaces/product.types"
import { shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http:HttpClient) { }

  ngOnInit(){
  }
  getProducts(){
    return this.http.get<ProductInterface[]>("../../assets/json/products.json").pipe(shareReplay(1));
  }
}
