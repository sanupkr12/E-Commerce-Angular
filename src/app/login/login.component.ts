import { Component } from '@angular/core';
import { userForm } from '../model/userForm.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  handleLogin(formData:userForm){
    console.log(formData);
  }
}
