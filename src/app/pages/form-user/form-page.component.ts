import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable, of, Subscription } from 'rxjs';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
})
export class FormPageComponent {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public user: User = {
    name: '',
    username: '',
    email: '',
    description: '',
    password: '',
    dateCreation: new Date(),
    id: '',
  };

  //* FORM:

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    description: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(this.emailPattern)],
      this.validateEmail(),
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  //* GETTERS:

  //* CONSTRUCTOR:

  constructor(private usersService: UserService, private fb: FormBuilder) {}
  //* LIFECYCLE HOOKS

  //* FUNCTIONS:

  public createUser(user: User) {
    this.usersService.createUser(user).subscribe({
      next: (res) => {
        console.log('res', res);
        this.usersService.users.push(user);
        console.log('users:', this.usersService.users);
      },
      error: (err) => {
        alert('there was an error at createUser');
      },
    });
  }

  public onSubmit() {
    if (this.myForm.invalid) {
      console.log(this.myForm.controls['email'].errors);

      this.myForm.markAllAsTouched();
    } else {
      //validar correo:

      //validar usuario:

      this.user = {
        name: this.myForm.controls['name'].value,
        username: '@' + this.myForm.controls['username'].value,
        email: this.myForm.controls['email'].value,
        password: this.myForm.controls['password'].value,
        dateCreation: new Date(),
        description: this.myForm.controls['description'].value,
        id: '',
      };

      this.createUser(this.user);
    }
  }

  //Check errors in field
  //? CREAR SERVICIO SOLO PARA VALIDACIONES DE FORMULARIOS?

  public isValidField(field: string, error: string) {
    return (
      this.myForm.controls[field].errors?.[error] &&
      this.myForm.controls[field].touched
    );
  }

  public validateEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (!value) {
        return of(null);
      }

      let datos: User[] = this.usersService.users.filter(
        (elem) => value === elem.email
      );

      let state: boolean = false;

      if (datos.length === 1) {
        state = true;
      }

      return of(state ? { emailTaken: true } : null);
    };
  }
}
