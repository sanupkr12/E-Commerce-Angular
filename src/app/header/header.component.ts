import { Component, SimpleChanges } from '@angular/core';
import { Input } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { cartInterface } from '../Interface/cartInterface';
import { UserInterface } from '../Interface/userInterface';
import { UserService } from '../user.service';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';
import { product } from '../Interface/productInterface';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username:string = "";
  userlist:UserInterface[] = [];
  cartItems:cartInterface[] = [];
  totalItems:number = 0;
  constructor(private authService:AuthService,private userService:UserService,private cartService:CartService,private router:Router){
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
    this.cartItems = [...this.cartService.cartList];
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
      this.updateItemCount();
    });
  }

  updateItemCount(){
    let itemCount = 0;
    let email = localStorage.getItem('email');
    let cart = JSON.parse(localStorage.getItem('cart') || '');
    if(!email){
      for(const key in cart['untracked']){
        itemCount+= cart['untracked'][key];
      }
    }
    else{
      for(const key in cart[email]){
        itemCount+= cart[email][key];
      }
    }
    this.totalItems = itemCount;
  }
  ngOnChanges(changes: SimpleChanges){
    this.updateItemCount();
  }

  handleLogout(){
    localStorage.removeItem('email');
    this.username = "";
    this.cartService.setCart([]);
    location.reload();
  }

  handleSearch(form:any){
    this.router.navigate(['/products'],{queryParams:{search:form.search}});
  }

}
