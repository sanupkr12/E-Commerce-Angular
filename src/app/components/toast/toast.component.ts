import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastService } from '../../common/services/toast.service';
import { Toast } from '../../common/interfaces/toast.types';
declare var bootstrap: any;
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})

export class ToastComponent {
  public message: string = "";
  @ViewChild('successToast') private successToastEl!: ElementRef;
  @ViewChild('errorToast') private errorToastEl!: ElementRef;

  constructor(private toastService: ToastService) {}
  
  ngOnInit() {
    this.toastService.showToast().subscribe((data:Toast) => {
      this.message = data.message;
      if(data.status === 'success')  {
        const toast = new bootstrap.Toast(this.successToastEl.nativeElement);
        toast.show()
      } else if(data.status === 'error') {
        const toast = new bootstrap.Toast(this.errorToastEl.nativeElement);
        toast.show()
      }
    })
  }
}