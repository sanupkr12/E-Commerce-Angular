import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { cartInterface } from '../../common/interfaces/cart.types';
import { UserInterface } from '../../common/interfaces/user.types';
import { UserService } from '../../common/services/user.service';
import { CartService } from '../../common/services/cart.service';
import { ProductService } from '../../common/services/product.service';
import { ProductInterface } from '../../common/interfaces/product.types';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public username:string = "";
  public userlist:UserInterface[] = [];
  public cartItems:cartInterface[] = [];
  public totalItems:number = 0;
  @ViewChild('searchInput',{static:false}) private searchInputRef!:ElementRef;
  
  constructor(private routerParam:ActivatedRoute,private authService:AuthService,private userService:UserService,private cartService:CartService,private router:Router){
  }

  ngOnInit(){
    this.routerParam.queryParams.subscribe((params)=>{
      console.log(params);
    })
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
