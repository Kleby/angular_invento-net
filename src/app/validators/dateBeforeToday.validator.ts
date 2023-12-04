import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function dateBeforeTodayValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        const selectedDate = new Date(`${control.value}T00:00`);
        selectedDate.setMinutes(selectedDate.getTimezoneOffset());
      
        if(!selectedDate) return null;
        
        const now = new Date();        

        const daySelect = selectedDate.getDate();
        const monthSelect = selectedDate.getMonth();
        const yearSelect = selectedDate.getFullYear();

        const today = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();

        if(yearSelect < year) return {dateBeforeToday: true}

        else if((yearSelect === year) && (monthSelect < month) ) return {dateBeforeToday: true}

        else if((yearSelect === year) && (monthSelect === month) && (daySelect <= today) ) return {dateBeforeToday: true}        
        
        return null;
    }
}