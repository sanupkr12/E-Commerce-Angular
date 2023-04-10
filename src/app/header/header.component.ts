import { Component } from '@angular/core';
import { Input } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { UserInterface } from '../Interface/userInterface';
import { UserService } from '../user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username:string = "";
  userlist:UserInterface[] = [];
  constructor(private authService:AuthService,private userService:UserService){
  }

  ngOnInit(){
    let email = localStorage.getItem('email');
    if(!email){
      this.username = "";
    }
    else{
      this.userService.getUsersList().subscribe((users:any)=>{
        this.userlist = users.credentials;
        for(let i=0;i<this.userlist.length;i++){
          if(this.userlist[i].email === email){
            this.username = this.userlist[i].username;
            break;
          }
        }
      })
    }

    this.authService.getUser().subscribe((user)=>{
      this.username = user;
    })
  }

}
