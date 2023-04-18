import { Component } from '@angular/core';
import { ToastService } from '../toast.service';
import { Toast } from '../Interface/toastInterface';
declare var bootstrap: any;
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})

export class ToastComponent {
  constructor(private toastService: ToastService) {}
  message: string = "";
  ngOnInit() {
    this.toastService.showToast().subscribe((data:Toast) => {
      this.message = data.message;
      if(data.status === 'success')  {
        const toastElement= document.getElementById('successToast')
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
      } else if(data.status == 'error') {
        const toastElement= document.getElementById('errorToast')
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
      }
    })
  }
}