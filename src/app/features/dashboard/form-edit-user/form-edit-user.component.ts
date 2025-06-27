import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../core/interfaces/user.interface';
import { switchMap, takeUntil } from 'rxjs';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';
import { UserService } from '../../../core/services/user.service';
import { ValidationsService } from '../../../core/services/validations.service';

@Component({
  selector: 'app-form-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-edit-user.component.html',
  styleUrl: './form-edit-user.component.scss',
})
export class FormEditUserComponent
  extends UnsubscribeDirective
  implements OnInit
{
  protected readonly usersService = inject(UserService);
  protected readonly validationsService = inject(ValidationsService);
  protected readonly fb = inject(FormBuilder);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  public newId: number = Date.now();
  public user!: User;

  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    image: [''],
  });

  public ngOnInit(): void {
    this.readAllUsers();
    this.rechargeInputs();
  }

  public backToUserPage(): void {
    let userIdParams = '';

    this.activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        userIdParams = params['id'];
      });

    this.router.navigate(['user-page', userIdParams]);
  }

  public editUser() {
    this.usersService
      .editUser(this.user, this.user.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['users-list']);
        },
        error: () => {
          alert('there was an error at editUser');
        },
      });
  }

  public onEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
    } else {
      this.user.name = this.editForm.controls['name'].value;
      this.user.description = this.editForm.controls['description'].value;
      this.user.password = this.editForm.controls['password'].value;
      this.user.image = this.editForm.controls['image'].value;

      this.editUser();
    }
  }

  public rechargeInputs() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.usersService.readUserById(id)),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (res) => {
          this.user = res;
          console.log('user', this.user);
          this.editForm.patchValue({
            name: this.user.name,
            description: this.user.description,
            password: this.user.password,
            image: this.user.image,
          });
        },
        error: (err) => {
          alert('There was a problem at rechargeInputs');
        },
      });
  }

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.editForm, field, error);
  }

  public readAllUsers() {
    this.usersService
      .readAllUsers()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this.usersService.users = res;
          console.log('USERS', this.usersService.users);
        },
        error: (err) => {
          alert('There was an error un readAllUsers');
        },
      });
  }
}
