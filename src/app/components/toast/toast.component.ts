import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../Interface/toastInterface';
declare var bootstrap: any;
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})

export class ToastComponent {
  constructor(private toastService: ToastService) {}
  @ViewChild('successToast') successToastEl!: ElementRef;
  @ViewChild('errorToast') errorToastEl!: ElementRef;
  message: string = "";
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