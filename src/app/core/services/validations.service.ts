import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationsService {
  //* VARIABLES:

  //* CONSTRUCTOR:

  constructor() {}

  //* FUNCIONES:


  public isValidField(form: FormGroup, field: string, error: string) {
    return (
      form.controls[field].errors?.[error] &&
      form.controls[field].touched
    );
  }
}
