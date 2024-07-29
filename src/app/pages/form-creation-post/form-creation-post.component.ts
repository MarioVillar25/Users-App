import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ValidationsService } from '../../services/validations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-creation-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './form-creation-post.component.html',
  styleUrl: './form-creation-post.component.scss',
})
export class FormCreationPostComponent {
  //* VARIABLES:

  public newId: number = Date.now();
  public tags: string[] = [];
  public newTag: string = '';
  public error: boolean = false;
  public post?: Post;
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

  //* FUNCTIONS:

  public onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      let userIdParams = '';

      let paramsPetition = this.activatedRoute.params.subscribe((params) => {
        userIdParams = params['id'];
        console.log('ID', userIdParams);
      });

      this.suscriptions.push(paramsPetition);

     this.post = {
        id: this.newId.toString(),
        userId: userIdParams,
        title: this.myForm.controls['title'].value,
        description: this.myForm.controls['description'].value,
        tags: this.tags,
        views: 0,
        dateCreation: new Date(),
      };
   this.post = {
        id: this.newId.toString(),
        userId: userIdParams,
        title: this.myForm.controls['title'].value,
        description: this.myForm.controls['description'].value,
        tags: this.tags,
        views: 0,
        dateCreation: new Date(),
      };

      this.createPost(this.post);
      this.router.navigate(['/user-page', userIdParams]);
      this.tags = [];
    }
  }

  public createPost(post: Post) {
    let createPetition = this.usersService.createPost(post).subscribe({
      next: () => {},
      error: () => {
        alert('There was a problem at createPost');
      },
    });

    this.suscriptions.push(createPetition);
  }

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

  public deleteTag(tag: string): void {
    let datos = this.tags.filter((elem) => elem !== tag);

    this.tags = datos;
  }

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.myForm, field, error);
  }
}
