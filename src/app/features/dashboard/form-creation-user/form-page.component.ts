import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, pipe, takeUntil } from 'rxjs';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { User } from '../../../core/interfaces/user.interface';
import { Router, RouterLink } from '@angular/router';
import { getUniqueId } from '../../../core/utils/utils';
import { ValidationsService } from '../../../core/services/validations.service';
import { UserService } from '../../../core/services/user.service';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
})
export class FormPageComponent extends UnsubscribeDirective {
  protected readonly usersService = inject(UserService);
  protected readonly validationsService = inject(ValidationsService);
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);

  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  user!: User;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required], this.validateUsername()],
    description: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(this.emailPattern)],
      this.validateEmail(),
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
    image: [''],
  });

  public createUser(user: User) {
    this.usersService.createUser(user).subscribe({
      next: () => {},
      error: () => {
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
        id: getUniqueId(3),
        image: this.myForm.controls['image'].value,
        totalPosts: 0,
        totalComments: 0,
      };

      this.createUser(this.user);

      this.router.navigate(['users-list']);
    }
  }

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.myForm, field, error);
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
