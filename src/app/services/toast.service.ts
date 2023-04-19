import { Injectable } from '@angular/core';
import { Toast } from '../Interface/toastInterface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastData = new Subject<Toast>;
  constructor() { }
  setToast(toast:Toast){
    this.toastData.next(toast);
  }
  showToast(){
    return this.toastData.asObservable();
  }
}
