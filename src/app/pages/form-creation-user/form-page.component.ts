import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
})
export class FormPageComponent {
  //* VARIABLES:

  public newId: number = Date.now();
  public suscriptions: Subscription[] = [];
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public user: User | undefined = {
    name: '',
    username: '',
    email: '',
    description: '',
    password: '',
    dateCreation: new Date(),
    id: this.newId.toString(),
  };

  //* FORM:

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required], this.validateUsername()],
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

  constructor(
    private usersService: UserService,
    private validationsService: ValidationsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
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

      this.myForm.markAllAsTouched();
    } else {
      this.user = {
        name: this.myForm.controls['name'].value,
        username: this.myForm.controls['username'].value,
        email: this.myForm.controls['email'].value,
        password: this.myForm.controls['password'].value,
        dateCreation: new Date(),
        description: this.myForm.controls['description'].value,
        id: this.newId.toString(),
      };

      this.createUser(this.user);

      this.router.navigate(['users-list']);
    }
  }




  //Check errors in field

  public isValidField(field: string, error: string) {

    return this.validationsService.isValidField(this.myForm, field, error)

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

  public validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;

      if (!value) {
        return of(null);
      }

      let datos: User[] = this.usersService.users.filter(
        (elem) => value === elem.username
      );

      let state: boolean = false;

      if (datos.length === 1) {
        state = true;
      }

      return of(state ? { usernameTaken: true } : null);
    };
  }
}
