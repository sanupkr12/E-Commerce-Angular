import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserInterface } from './Interface/userInterface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new Subject<string>();
  userList:UserInterface[] = [];

  constructor(private userService:UserService){

  }
  
  setUser(user:string){
    this.user.next(user);
  }

  getUser():Observable<any>{
    return this.user.asObservable();
  }

  isValidUser(email:string){
    for(let i=0;i<this.userList.length;i++){
      if(this.userList[i].email===email){
        return true;
      }
    }
    return false;
  }
}
