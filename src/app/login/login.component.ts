import { Component } from '@angular/core';
import { userForm } from '../model/userForm.model';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router:Router){
  }

  handleLogin(formData:userForm){
    this.router.navigate(['/products']);
  }
}
