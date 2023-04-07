import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { UserInterface } from './Interface/userInterface';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userList:UserInterface[] = [];
  constructor(private userService:UserService,private authService:AuthService){

  }

  ngOnInit() {
    let email = localStorage.getItem('user');
    this.userService.getUsersList().subscribe((data:any) =>{
      this.userList = data.credentials;
      if(!email){
        this.authService.setUser("");
      }
      else{
        for(let i=0;i<this.userList.length;i++){
          let user = this.userList[i];
          if(user.email === email){
            this.authService.setUser(user.username);
            break;
          }
        }
      }
    });
  };
}
