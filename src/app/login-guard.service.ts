import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserInterface } from './Interface/userInterface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{
  userlist:UserInterface[] = [];
  username:string = "";
  constructor(private userService:UserService,private authService:AuthService,private router:Router) {
    this.authService.getUser().subscribe((user)=>{
      this.username = user;
    })
  }

  ngOnInit(){
    
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
    // let email = localStorage.getItem('email');
    // let isLoggedIn = false;
    // for(let i=0;i<this.userlist.length;i++){
    //   if(this.userlist[i].email === email){
    //     isLoggedIn = true;
    //     break;
    //   }
    // }

    // if(isLoggedIn){
    //   this.router.navigate(['/products']);
    //     return false;
    // }
    // else{
    //   return true;
    // } 
    if(this.username.length > 0){
        this.router.navigate(['/products']);
        return false;
    }
    else{
      return true;
    }
    
  }
}
