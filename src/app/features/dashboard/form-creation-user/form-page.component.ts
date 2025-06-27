import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { User } from '../../../core/interfaces/user.interface';
import { Router, RouterLink } from '@angular/router';
import { ValidationsService } from '../../services/validations.service';
import { getUniqueId, unsubscribePetition } from '../../../core/utils/utils';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
})
export class FormPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public user!: User

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
    image: [''],
  });

  //* GETTERS:

  //* CONSTRUCTOR:

  constructor(
    private usersService: UserService,
    private validationsService: ValidationsService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions)
  }

  //* FUNCTIONS:

  //To create user

  public createUser(user: User) {
    this.usersService.createUser(user).subscribe({
      next: () => {},
      error: () => {
        alert('there was an error at createUser');
      },
    });
  }

  //To submit form

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

  //Check errors in field

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

  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.usersService.readAllUsers().subscribe({
      next: (res) => {
        this.usersService.users = res;
        console.log('USERS', this.usersService.users);
      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });

    this.suscriptions.push(allUsersPetition);
  }

  //Read all posts

  public readAllPosts() {
    let allPostsPetition = this.usersService.readAllPosts().subscribe({
      next: (res) => {
        this.usersService.posts = res;
        console.log('POSTS', this.usersService.posts);
      },
      error: (err) => {
        alert('There was an error un readAllPosts');
      },
    });

    this.suscriptions.push(allPostsPetition);
  }

  //Read all comments

  public readAllComments() {
    let allCommentsPetition = this.usersService.readAllComments().subscribe({
      next: (res) => {
        this.usersService.comments = res;
        console.log('COMENTARIOS', this.usersService.comments);
      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });

    this.suscriptions.push(allCommentsPetition);
  }
}
