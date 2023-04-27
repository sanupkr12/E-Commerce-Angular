import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { UserInterface } from '../interfaces/user.types';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{
  public userlist:UserInterface[] = [];
  public username:string = "";
  constructor(private userService:UserService,private router:Router) {
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
