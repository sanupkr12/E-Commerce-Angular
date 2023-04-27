import { Injectable } from '@angular/core';
import { Toast } from '../interfaces/toast.types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toastData = new Subject<Toast>;
  constructor() { }

  setToast(toast:Toast){
    this.toastData.next(toast);
  }
  
  showToast(){
    return this.toastData.asObservable();
  }
}
