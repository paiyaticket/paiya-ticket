import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function dateLaterThanEndTimeValidator(endTime : Date) : ValidatorFn {
    return (control : AbstractControl) : ValidationErrors | null => {
        // console.log("== dateLaterThanEndTimeValidator ==");
        // console.log(endTime);
        // console.log(control.value);
        return (control.value > endTime) ? {dateLaterThanEndTime : true} : null;
    }
}