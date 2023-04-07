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

  constructor(private authService:AuthService){
  }

  ngOnInit(){
    this.authService.getUser().subscribe((user)=>{
      this.username = user;
    })
  }

}
