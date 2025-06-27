import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../core/interfaces/post.interface';
import { Subscription, takeUntil } from 'rxjs';
import { User } from '../../../core/interfaces/user.interface';
import { getUniqueId } from '../../../core/utils/utils';
import { UserService } from '../../../core/services/user.service';
import { ValidationsService } from '../../../core/services/validations.service';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

@Component({
  selector: 'app-form-creation-post',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './form-creation-post.component.html',
  styleUrl: './form-creation-post.component.scss',
})
export class FormCreationPostComponent
  extends UnsubscribeDirective
  implements OnInit
{
  protected readonly usersService = inject(UserService);
  protected readonly validationsService = inject(ValidationsService);
  protected readonly fb = inject(FormBuilder);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  tags: string[] = [];
  newTag: string = '';
  repeatedTag: string = '';
  error: boolean = false;
  errorEmpty: boolean = false;
  errorLength: boolean = false;
  post?: Post;
  suscriptions: Subscription[] = [];
  user!: User;

  myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    image: [''],
  });

  public ngOnInit(): void {
    this.readAllComments();
    this.readAllPosts();
    this.readAllUsers();
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


  public onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      let userIdParams = '';

       this.activatedRoute.params
        .pipe(takeUntil(this._destroy$))
        .subscribe((params) => {
          userIdParams = params['id'];
        });


      this.post = {
        id: getUniqueId(3),
        userId: userIdParams,
        title: this.myForm.controls['title'].value,
        description: this.myForm.controls['description'].value,
        tags: this.tags,
        views: 0,
        dateCreation: new Date(),
        image: this.myForm.controls['image'].value,
        totalComments: 0,
      };

      this.createPost(this.post);
      this.tags = [];

      setTimeout(() => {
        this.router.navigate(['/user-page', userIdParams]);
      }, 1000);
    }
  }

  public createPost(post: Post) {
    this.usersService
      .createPost(post)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          console.log('POST CREADO');
        },
        error: () => {
          alert('There was a problem at createPost');
        },
      });
  }


  public addTag(): void {
    if (this.tags.length <= 5) {
      this.errorLength = false;
    }

    if (this.newTag === '' && this.tags.length !== 5) {
      this.errorEmpty = true;
    } else {
      this.errorEmpty = false;

      let datos = this.tags.filter((elem) => elem === this.newTag);

      if (datos.length === 1) {
        this.error = true;
        this.repeatedTag = this.newTag;
        this.newTag = '';
      } else {
        this.error = false;

        if (this.tags.length < 5) {
          this.tags.push(this.newTag);
          this.newTag = '';
        } else {
          this.errorLength = true;
        }
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

  public readAllPosts() {
    this.usersService
      .readAllPosts()
      .pipe(takeUntil(this._destroy$))

      .subscribe({
        next: (res) => {
          this.usersService.posts = res;
          console.log('POSTS', this.usersService.posts);
        },
        error: (err) => {
          alert('There was an error un readAllPosts');
        },
      });
  }

  public readAllComments() {
    this.usersService
      .readAllComments()
      .pipe(takeUntil(this._destroy$))

      .subscribe({
        next: (res) => {
          this.usersService.comments = res;
          console.log('COMENTARIOS', this.usersService.comments);
        },
        error: (err) => {
          alert('There was an error un readAllComments');
        },
      });
  }
}
