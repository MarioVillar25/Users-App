import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, takeUntil } from 'rxjs';
import { User } from '../../../core/interfaces/user.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../core/interfaces/post.interface';
import { Comment } from '../../../core/interfaces/comment.interface';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { CommentCardComponent } from '../../../shared/components/comment-card/comment-card.component';
import { UserService } from '../../../core/services/user.service';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [PostCardComponent, CommonModule, RouterLink, CommentCardComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent extends UnsubscribeDirective implements OnInit {
  protected readonly userService = inject(UserService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  public user!: User;
  public userPosts: Post[] = [];
  public userComments: Comment[] = [];

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    this.readUserById();
    setTimeout(() => {
      this.getTotalPosts();
    }, 500);
  }

  public getTotalPosts(): void {
    let userIdParams = '';

    this.activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        userIdParams = params['id'];
      });

    let dataUser = this.userService.users.filter(
      (elem) => elem.id === userIdParams
    );

    this.user = dataUser[0];

    let dataPosts = this.userService.posts.filter(
      (elem) => elem.userId === userIdParams
    );

    this.user.totalPosts = dataPosts.length;

    this.editUser();
  }

  public editUser(): void {
    this.userService
      .editUser(this.user, this.user.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {},
        error: () => {
          alert('there was an error at editUser');
        },
      });
  }

  public readCommentsByUserId() {
    let userIdParams = '';

    this.activatedRoute.params
      .pipe(takeUntil(this._destroy$))
      .subscribe((params) => {
        userIdParams = params['id'];
      });

    this.userService
      .readAllComments()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          let data = res.filter((elem) => elem.userId === userIdParams);
          this.userComments = data;
        },
        error: (err) => {
          alert('There was a problem at readCommentsByUserId');
        },
      });
  }

  public readUserPosts(): void {
    let data = this.userService.posts.filter(
      (elem) => elem.userId === this.user.id
    );

    this.userPosts = data;
  }

  public readUserById() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.userService.readUserById(id)),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (res) => {
          this.user = res;

          setTimeout(() => {
            this.readUserPosts();
          }, 500);

          this.readCommentsByUserId();
        },
        error: (err) => {
          alert('There was a problem at readUserById');
        },
      });
  }

  public deletePostsByUserId(): Post[] {
    let data = this.userService.posts.filter((elem) => {
      if (elem.userId === this.user.id) {
        this.userService
          .deletePost(elem.id)
          .pipe(takeUntil(this._destroy$))
          .subscribe({
            next: (res) => {},
            error: () => {
              alert('There was an error at deleteCommentById');
            },
          });
      }
    });

    return data;
  }

  public deleteCommentsByUserId(): Comment[] {
    let data = this.userService.comments.filter((elem) => {
      if (elem.userId === this.user.id) {
        this.userService
          .deleteComment(elem.id)
          .pipe(takeUntil(this._destroy$))
          .subscribe({
            next: (res) => {},
            error: () => {
              alert('There was an error at deleteCommentById');
            },
          });
      }
    });

    return data;
  }

  public deleteUserById() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.userService.deleteUser(id)),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: (res) => {
          this.deleteCommentsByUserId();
          this.deletePostsByUserId();
          setTimeout(() => {
            this.router.navigate(['/users-list']);
          }, 500);
        },
        error: () => {
          alert('There was an error at deleteUserById');
        },
      });
  }

  public getCommentsArray(comments: Comment[]) {
    return (this.userComments = comments);
  }

  public readAllUsers() {
    this.userService
      .readAllUsers()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this.userService.users = res;
        },
        error: (err) => {
          alert('There was an error un readAllUsers');
        },
      });
  }

  //Read all posts

  public readAllPosts() {
    this.userService
      .readAllPosts()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this.userService.posts = res;
        },
        error: (err) => {
          alert('There was an error un readAllPosts');
        },
      });
  }

  //Read all comments

  public readAllComments() {
    this.userService
      .readAllComments()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this.userService.comments = res;
        },
        error: (err) => {
          alert('There was an error un readAllComments');
        },
      });
  }
}
