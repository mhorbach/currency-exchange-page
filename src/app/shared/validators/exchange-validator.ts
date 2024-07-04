import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exchangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isValid = /^\d*\.?\d+$/.test(value);
    return !isValid ? { invalidNumber: { value: control.value } } : null;
  };
}
