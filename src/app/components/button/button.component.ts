import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Output() submitEmmiter: EventEmitter<any> = new EventEmitter<any>();

  onSubmit(){
    this.submitEmmiter.emit();
  }

}
