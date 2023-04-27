import { Component } from '@angular/core';
import { UserFormInterface } from '../../common/interfaces/user-form.types';
import { UserService } from '../../common/services/user.service';
import {Router} from "@angular/router"
import { UserInterface } from '../../common/interfaces/user.types';
import { AuthService } from '../../common/services/auth.service';
import { CartService } from '../../common/services/cart.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public userlist:UserInterface[] = [];
  public errorMessage:string = '';
  constructor(private router:Router,private userService:UserService,private authService:AuthService,private cartService:CartService){
    
  }

  ngOnInit(){
    this.userService.getUsersList().subscribe((users:any)=>{
      this.userlist = users.credentials;
      let email = localStorage.getItem('email');
      for(let i=0;i<this.userlist.length;i++){
        if(this.userlist[i].email === email){
          this.router.navigate(['/products']);
        }
      }
    })
  }

  handleLogin(formData:UserFormInterface){
    let email = formData.email;
    let password = formData.password;
    this.userlist.map((user)=>{
      if(user.email===email && user.password===password){
        localStorage.setItem('email',user.email);
        this.authService.setUser(user.username);
        this.cartService.populateCart();
        this.router.navigate(['/products']);
      }
    });
    this.errorMessage = "Invalid Credentials";
  }
}
