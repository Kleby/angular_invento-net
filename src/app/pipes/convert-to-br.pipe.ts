import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToBr'
})
export class ConvertToBrPipe implements PipeTransform {

  transform(value: string): string {
    
    const toBr = `R$ ${value.replace(/\./, ',')}`;
    return toBr;
  }

}
