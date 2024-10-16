import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateEarlyThanStartTimeValidator(startTime : Date) : ValidatorFn {
    return (control : AbstractControl) : ValidationErrors | null => {
        // console.log("== dateEarlyThanStartTimeValidator ==");
        // console.log(startTime);
        // console.log(control.value);
        return (control.value < startTime) ? {dateEarlyThanStartTime : true} : null;
    }
}