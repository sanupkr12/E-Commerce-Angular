import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{
  user:string = "";
  constructor(private authService:AuthService,private router:Router) {
      
  }

  ngOnInit(){
    this.authService.getUser().subscribe((user)=>{
      this.user = user;
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
      if(this.user.length === 0 ){
        return true;
      }
      else{
          this.router.navigate(['/products']);
          return false;
      }
  }
}
