import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective {
  @HostListener('click',['$event']) onClick(event:any){event.srcElement.attributes.class.value = "btn btn-sm btn-secondary"}
  constructor() { }

}
