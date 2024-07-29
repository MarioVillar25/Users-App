import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ValidationsService } from '../../services/validations.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-form-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form-edit-post.component.html',
  styleUrl: './form-edit-post.component.scss',
})
export class FormEditPostComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public tags: string[] = [];
  public newTag: string = '';
  public error: boolean = false;
  public post!: Post;
  public suscriptions: Subscription[] = [];

  //* FORM:

  public myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  //* CONSTRUCTOR:

  constructor(
    private usersService: UserService,
    private validationsService: ValidationsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  //* LIFE CYCLEHOOKS

  ngOnInit(): void {
    this.rechargeInputs();
  }

  ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  //To recharge Inputs when component is created

  public rechargeInputs() {
    let readByIdPetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.usersService.readPostById(id)))
      .subscribe({
        next: (res) => {
          this.post = res;
          this.tags = res.tags;
          this.myForm.patchValue({
            title: this.post.title,
            description: this.post.description,
          });
        },
        error: (err) => {
          alert('There was a problem at rechargeInputs');
        },
      });

    this.suscriptions.push(readByIdPetition);
  }

  //To Submit button from Form

  onEdit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      this.post.title = this.myForm.controls['title'].value;
      this.post.description = this.myForm.controls['description'].value;
      this.post.tags = this.tags;

      this.editPost();
    }
  }

  //To edit Post

  public editPost() {
    let editPetition = this.usersService
      .editPost(this.post, this.post.id)
      .subscribe({
        next: () => {
          this.router.navigate(['post-page', this.post.id]);
        },
        error: (err) => {
          alert('there was an error at editPost');
        },
      });

    this.suscriptions.push(editPetition);
  }

  //To add a new tag

  public addTag(): void {
    let datos = this.tags.filter((elem) => elem === this.newTag);

    if (datos.length === 1) {
      this.error = true;

      this.newTag = '';
    } else {
      this.error = false;

      if (this.tags.length < 5) {
        this.tags.push(this.newTag);

        this.newTag = '';
      }
    }
  }

  //To delete a tag

  public deleteTag(tag: string): void {
    let datos = this.tags.filter((elem) => elem !== tag);
    this.tags = datos;
  }

  //To check if a field is valid

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.myForm, field, error);
  }
}
