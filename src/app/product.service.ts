import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {product} from "./Interface/productInterface"
import { shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http:HttpClient) { }

  getProducts(){
    return this.http.get<product[]>("../../assets/json/products.json").pipe(shareReplay(1));
  }
}
