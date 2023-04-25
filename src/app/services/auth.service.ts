import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserInterface } from '../Interface/userInterface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userList:UserInterface[] = [];
  private _user = new BehaviorSubject<string>("");

  constructor(private userService:UserService){

  }

  ngOnInit(){
    this.userService.getUsersList().subscribe((users:any)=>{
      this.userList = users;
    });
  }
  
  setUser(user:string){
    this._user.next(user);
  }

  getUser():Observable<any>{
    return this._user.asObservable();

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
