import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUsersList(){
    return this.http.get("../../assets/json/credentials.json").pipe(shareReplay(1));
  }
}
