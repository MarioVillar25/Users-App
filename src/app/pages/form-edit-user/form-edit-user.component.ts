import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ValidationsService } from '../../services/validations.service';
import { unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-form-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-edit-user.component.html',
  styleUrl: './form-edit-user.component.scss',
})
export class FormEditUserComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public newId: number = Date.now();
  public suscriptions: Subscription[] = [];
  public user!: User;

  //* FORM:

  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });


  //* CONSTRUCTOR:

  constructor(
    private usersService: UserService,
    private validationsService: ValidationsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  //* LIFECYCLE HOOKS

  ngOnInit(): void {
    this.rechargeInputs();
  }

  ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  public editUser() {
    let editPetition = this.usersService
      .editUser(this.user, this.user.id)
      .subscribe({
        next: () => {
          this.router.navigate(['users-list']);
        },
        error: () => {
          alert('there was an error at editUser');
        },
      });

    this.suscriptions.push(editPetition);
  }

  public onEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
    } else {
      this.user.name = this.editForm.controls['name'].value;
      this.user.description = this.editForm.controls['description'].value;
      this.user.password = this.editForm.controls['password'].value;

      this.editUser();
    }
  }

  public rechargeInputs() {
    let readByIdPetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.usersService.readUserById(id)))
      .subscribe({
        next: (res) => {
          this.user = res;
          console.log('user', this.user);
          this.editForm.patchValue({
            name: this.user.name,
            description: this.user.description,
            password: this.user.password,
          });
        },
        error: (err) => {
          alert('There was a problem at rechargeInputs');
        },
      });

    this.suscriptions.push(readByIdPetition);
  }

  //Check errors in field

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.editForm, field, error);
  }
}
