import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currDate:Date = new Date();

  ngOnInit(){
    setInterval(()=>{this.updateDate()},1000);
  }

  updateDate(){
    this.currDate = new Date();
  }

}
