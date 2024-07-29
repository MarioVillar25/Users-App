import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Subscription, switchMap } from 'rxjs';
import { Post } from '../../interfaces/post.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getUniqueId, unsubscribePetition } from '../../utils/utils';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from '../../components/comment-card/comment-card.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationsService } from '../../services/validations.service';
import { Comment } from '../../interfaces/comment.interface';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [
    PostCardComponent,
    CommonModule,
    RouterLink,
    CommentCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})
export class PostPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];
  public post?: Post;
  public comment?: Comment;
  public commentsByPost: Comment[] = [];

  //* FORM:

  public myForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required]],
  });

  //*CONSTRUCTOR

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private validationsService: ValidationsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  //* LIFECYCLE HOOKS

  ngOnInit(): void {
    this.readPostById();
    this.readCommentsByPostId();
  }

  ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  public readCommentsByPostId() {
    let postIdParams = '';

    let paramsUserPetition = this.activatedRoute.params.subscribe((params) => {
      postIdParams = params['postId'];
    });

    let readPetition = this.userService.readAllComments().subscribe({
      next: (res) => {
        let data = res.filter((elem) => elem.postId === postIdParams);
        this.commentsByPost = data;
      },
      error: (err) => {
        alert('There was a problem at readCommentsByPostId');
      },
    });

    this.suscriptions.push(paramsUserPetition, readPetition);
  }

  public readPostById() {
    let readPostPetition = this.activatedRoute.params
      .pipe(switchMap(({ postId }) => this.userService.readPostById(postId)))
      .subscribe({
        next: (res) => {
          this.post = res;
        },
        error: (err) => {
          alert('There was a problem at readPostById');
        },
      });

    this.suscriptions.push(readPostPetition);
  }

  public deletePostById() {
    let deletePetition = this.activatedRoute.params
      .pipe(switchMap(({ postId }) => this.userService.deletePost(postId)))
      .subscribe({
        next: (res) => {
          console.log('delete', res);
          this.router.navigate(['/posts-list']);
        },
        error: () => {
          alert('There was an error at deletePostById');
        },
      });

    this.suscriptions.push(deletePetition);
  }

  public createComment(comment: Comment) {
    let createPetition = this.userService.createComment(comment).subscribe({
      next: (res) => {
        this.commentsByPost.push(res);
      },
      error: () => {
        alert('There was a problem at createComment');
      },
    });

    this.suscriptions.push(createPetition);
  }

  public onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      let userIdParams = '';
      let postIdParams = '';

      let paramsUserPetition = this.activatedRoute.params.subscribe(
        (params) => {
          userIdParams = params['userId'];
        }
      );

      let paramsPostPetition = this.activatedRoute.params.subscribe(
        (params) => {
          postIdParams = params['postId'];
        }
      );

      this.suscriptions.push(paramsUserPetition, paramsPostPetition);

      this.comment = {
        id: getUniqueId(3),
        text: this.myForm.controls['comment'].value,
        postId: postIdParams,
        userId: userIdParams,
        dateCreation: new Date(),
      };

      this.createComment(this.comment);

      this.myForm.setValue({
        comment: '',
      });

      this.myForm.markAsUntouched();
    }
  }

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.myForm, field, error);
  }

  public getCommentsArray(comments: Comment[]) {
    return (this.commentsByPost = comments);
  }
}
