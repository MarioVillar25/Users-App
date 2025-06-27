import { Component, inject, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getUniqueId } from '../../../core/utils/utils';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Comment } from '../../../core/interfaces/comment.interface';
import { User } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { ValidationsService } from '../../../core/services/validations.service';
import { CommentCardComponent } from '../../../shared/components/comment-card/comment-card.component';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

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
export class PostPageComponent extends UnsubscribeDirective implements OnInit {
  protected readonly userService = inject(UserService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly validationsService = inject(ValidationsService);
  protected readonly router = inject(Router);
  protected readonly fb = inject(FormBuilder);

  post!: Post;
  comment!: Comment;
  commentsByPost: Comment[] = [];
  user!: User;

  myForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required]],
  });

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    this.readPostById();
    this.readCommentsByPostId();
  }

  public backToUserPage(): void {
    let userIdParams = '';

    this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['userId'];
    });

    this.router.navigate(['user-page', userIdParams]);
  }

  public getTotalComments(): void {
    this.user.totalComments = this.commentsByPost.length;
    this.post.totalComments = this.commentsByPost.length;

    this.editPost();
    this.editUser();
  }

  public editPost(): void {
    this.userService.editPost(this.post, this.post.id).subscribe({
      next: () => {},
      error: () => {
        alert('there was an error at editUser');
      },
    });
  }

  public editUser(): void {
    this.userService.editUser(this.user, this.user.id).subscribe({
      next: () => {},
      error: () => {
        alert('there was an error at editUser');
      },
    });
  }

  public readUserById(): void {
    let userIdParams = '';

    this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['userId'];
    });

    let data = this.userService.users.filter(
      (elem) => elem.id === userIdParams
    );

    this.user = data[0];
  }

  public readCommentsByPostId() {
    let postIdParams = '';

    this.activatedRoute.params.subscribe((params) => {
      postIdParams = params['postId'];
    });

    this.userService.readAllComments().subscribe({
      next: (res) => {
        let data = res.filter((elem) => elem.postId === postIdParams);
        this.commentsByPost = data;
      },
      error: (err) => {
        alert('There was a problem at readCommentsByPostId');
      },
    });
  }

  public readPostById() {
    this.activatedRoute.params
      .pipe(switchMap(({ postId }) => this.userService.readPostById(postId)))
      .subscribe({
        next: (res) => {
          this.post = res;
        },
        error: (err) => {
          alert('There was a problem at readPostById');
        },
      });
  }

  public deletePostById() {
    this.activatedRoute.params
      .pipe(switchMap(({ postId }) => this.userService.deletePost(postId)))
      .subscribe({
        next: (res) => {
          this.deleteCommentsByPostId();
          setTimeout(() => {
            this.router.navigate(['/user-page', this.user.id]);
          }, 500);
        },
        error: () => {
          alert('There was an error at deletePostById');
        },
      });
  }

  public deleteCommentsByPostId(): Comment[] {
    let data = this.userService.comments.filter((elem) => {
      if (elem.postId === this.post.id) {
        this.userService.deleteComment(elem.id).subscribe({
          next: (res) => {},
          error: () => {
            alert('There was an error at deleteCommentById');
          },
        });
      }
    });

    return data;
  }

  public createComment(comment: Comment) {
    this.userService.createComment(comment).subscribe({
      next: (res) => {
        this.commentsByPost.push(res);
      },
      error: () => {
        alert('There was a problem at createComment');
      },
    });

    setTimeout(() => {
      this.getTotalComments();
    }, 1000);
  }

  public onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      let userIdParams = '';
      let postIdParams = '';

      this.activatedRoute.params.subscribe((params) => {
        userIdParams = params['userId'];
      });

      this.activatedRoute.params.subscribe((params) => {
        postIdParams = params['postId'];
      });

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

  public getCommentsArray(comments: Comment[]): void {
    this.commentsByPost = comments;
    this.getTotalComments();
  }

  public readAllUsers() {
    this.userService.readAllUsers().subscribe({
      next: (res) => {
        this.userService.users = res;
        this.readUserById();
        console.log('USERS', this.userService.users);
      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });
  }

  public readAllPosts() {
    this.userService.readAllPosts().subscribe({
      next: (res) => {
        this.userService.posts = res;
        console.log('POSTS', this.userService.posts);
      },
      error: (err) => {
        alert('There was an error un readAllPosts');
      },
    });
  }

  public readAllComments() {
    this.userService.readAllComments().subscribe({
      next: (res) => {
        this.userService.comments = res;
        console.log('COMENTARIOS', this.userService.comments);
      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });
  }
}
