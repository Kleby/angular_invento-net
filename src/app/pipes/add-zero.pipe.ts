import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'addZero'
})
export class AddZeroPipe implements PipeTransform{
    valueNumber!: number;
    transform(value: number | string) : string{
        if(typeof value === 'string' && parseInt(value)){
            this.valueNumber = parseInt(value);
        }
        return (this.valueNumber < 10 ? `0${value}` : `${value}`);

    }
}