import { Component } from '@angular/core';
import { userForm } from '../model/userForm.model';
import { UserService } from '../user.service';
import {Router} from "@angular/router"
import { UserInterface } from '../Interface/userInterface';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userlist:UserInterface[] = [];
  errorMessage:string = '';
  constructor(private router:Router,private userService:UserService,private authService:AuthService){
  }

  ngOnInit(){
    this.userService.getUsersList().subscribe((users:any)=>{
        this.userlist = users.credentials;
    })
  }

  handleLogin(formData:userForm){
    let email = formData.email;
    let password = formData.password;
    this.userlist.map((user)=>{
      if(user.email===email && user.password===password){
        localStorage.setItem('email',user.email);
        this.authService.setUser(user.username);
        this.router.navigate(['/products']);
      }
    });
    this.errorMessage = "Invalid Credentials";
  }
}
