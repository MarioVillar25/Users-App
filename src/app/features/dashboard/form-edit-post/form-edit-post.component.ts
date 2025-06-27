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
import { Subscription, switchMap, takeUntil } from 'rxjs';
import { ValidationsService } from '../../../core/services/validations.service';
import { UserService } from '../../../core/services/user.service';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

@Component({
  selector: 'app-form-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './form-edit-post.component.html',
  styleUrl: './form-edit-post.component.scss',
})
export class FormEditPostComponent
  extends UnsubscribeDirective
  implements OnInit
{
  protected readonly usersService = inject(UserService);
  protected readonly validationsService = inject(ValidationsService);
  protected readonly fb = inject(FormBuilder);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  public tags: string[] = [];
  public newTag: string = '';
  public repeatedTag: string = '';
  public error: boolean = false;
  public errorEmpty: boolean = false;
  public errorLength: boolean = false;
  public post!: Post;
  public suscriptions: Subscription[] = [];

  public myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    image: [''],
  });

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    this.rechargeInputs();
  }

  public backToUserPage(): void {
    let userIdParams = '';
    let postIdParams = '';

    this.activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        userIdParams = params['userId'];
      });

    this.activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        userIdParams = params['postId'];
      });

    this.router.navigate([
      'user-page',
      postIdParams,
      'post-page',
      userIdParams,
    ]);
  }

  public rechargeInputs() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ postId }) => this.usersService.readPostById(postId)),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (res) => {
          this.post = res;
          this.tags = res.tags;
          this.myForm.patchValue({
            title: this.post.title,
            description: this.post.description,
            image: this.post.image,
          });
        },
        error: (err) => {
          alert('There was a problem at rechargeInputs');
        },
      });
  }

  public onEdit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      this.post.title = this.myForm.controls['title'].value;
      this.post.description = this.myForm.controls['description'].value;
      this.post.tags = this.tags;
      this.post.image = this.myForm.controls['image'].value;

      this.editPost();
    }
  }

  public editPost() {
    this.usersService
      .editPost(this.post, this.post.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['posts-list']);
        },
        error: (err) => {
          alert('there was an error at editPost');
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
        },
        error: (err) => {
          alert('There was an error un readAllComments');
        },
      });
  }
}
