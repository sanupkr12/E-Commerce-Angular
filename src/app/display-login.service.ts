import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayLoginService {
  isLoginPage:boolean = false;
  constructor() { }
}
