import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const laterDateValidator : ValidatorFn = (control : AbstractControl) : ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    return (startTime && endTime && startTime > endTime) ? {laterDate : true} : null;
}