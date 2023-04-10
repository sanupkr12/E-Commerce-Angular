import { Component } from '@angular/core';
import { CartService } from '../cart.service';
@Component({
  selector: 'app-order-upload',
  templateUrl: './order-upload.component.html',
  styleUrls: ['./order-upload.component.css']
})
export class OrderUploadComponent {

  constructor(private cartService:CartService){

  }

  ngOnInit(){
    this.cartService.initializeCart();
    this.cartService.validateCart();
  }
}
