import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { cartInterface } from '../../Interface/cartInterface';
import { UserInterface } from '../../Interface/userInterface';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { product } from '../../Interface/productInterface';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username:string = "";
  userlist:UserInterface[] = [];
  cartItems:cartInterface[] = [];
  totalItems:number = 0;
  @ViewChild('searchInput',{static:false}) searchInputRef!:ElementRef;
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
    this.cartService.getCart().subscribe((res)=>{
      this.cartItems = [...res];
      this.updateItemCount();
    });
  }

  updateItemCount(){
    let itemCount = 0;
    for(let i=0;i<this.cartItems.length;i++){
      itemCount+=this.cartItems[i].quantity ? this.cartItems[i].quantity : 0;
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
    this.searchInputRef.nativeElement.value = "";
  }

}
