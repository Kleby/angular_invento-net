import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validator } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input() idInput: string = '';
  @Input() typeInput: string = 'text';
  @Input() placeholderInput: string = '';
  @Input() labelText: string = '';
  @Input() messageError: string = '';
  @Input() validatorMessage: string = '';
  @Input() controlName!: FormControl | any;
  @Output() dateFormatBr: EventEmitter<string> = new EventEmitter<string>();

  statusValidator: string = '';

  get isValidDate(){
    return this.statusValidator === 'INVALID';
  }

  get isError(){
    return ((this.controlName.errors && this.controlName.touched) || this.controlName.dirty)
  }

  ngOnInit(): void {      
  }

  onChangeDate(event: any): string | null | void{
    this.statusValidator = this.controlName.status;
    
    const type = event.target.type;     
    if(type === 'date'){
      const date = new Date(`${event.target.value}T00:00`); 
      date.setMinutes(date.getTimezoneOffset());
      const dateBr = date.toLocaleDateString('pt-BR').split('-')[0];
      return this.dateFormatBr.emit(dateBr);
    }    
    
    return null;
  }

}
