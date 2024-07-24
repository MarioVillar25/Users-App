import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
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
    password: '',
    dateCreation: new Date(),
    id: '',
  };

  //* FORM:

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
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
      this.myForm.markAllAsTouched();
      console.log('valid:', this.myForm.valid);
      console.log('status:', this.myForm.status);
      console.log('pending:', this.myForm.pending);
      console.log(this.myForm.controls['name'].value);
      console.log('name errors', this.myForm.controls['name'].errors);
      console.log('email errors', this.myForm.controls['email'].errors);
    } else {

      this.user = {
        name: this.myForm.controls['name'].value,
        username:'@' + this.myForm.controls['username'].value,
        email: this.myForm.controls['email'].value,
        password: this.myForm.controls['password'].value,
        dateCreation: new Date(),
        id: ''
      };

      this.createUser(this.user);
    }
  }

  //Check errors in field

  public isValidField(field: string) {
    return this.usersService.isValidField(this.myForm, field);
  }
}
