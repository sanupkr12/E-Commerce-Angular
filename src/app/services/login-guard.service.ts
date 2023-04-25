import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserInterface } from '../Interface/userInterface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{
  userlist:UserInterface[] = [];
  username:string = "";
  constructor(private userService:UserService,private authService:AuthService,private router:Router) {
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
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
    if(this.username.length > 0){
        this.router.navigate(['/products']);
        return false;
    }
    else{
      return true;
    }
    
  }
}
