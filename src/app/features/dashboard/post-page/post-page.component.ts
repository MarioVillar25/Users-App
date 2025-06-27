import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostCardComponent } from '../../../components/post-card/post-card.component';
import { Subscription, switchMap } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getUniqueId, unsubscribePetition } from '../../../core/utils/utils';
import { CommonModule } from '@angular/common';
import { CommentCardComponent } from '../../../components/comment-card/comment-card.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationsService } from '../../services/validations.service';
import { Comment } from '../../../core/interfaces/comment.interface';
import { User } from '../../../core/interfaces/user.interface';

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
  public post!: Post;
  public comment!: Comment;
  public commentsByPost: Comment[] = [];
  public user!: User;

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

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    this.readPostById();
    this.readCommentsByPostId();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:


  public backToUserPage(): void {
    let userIdParams = '';

    let bringUserPetition = this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['userId'];
    });

    this.suscriptions.push(bringUserPetition);

    this.router.navigate(['user-page', userIdParams]);
  }

  public getTotalComments(): void {
    this.user.totalComments = this.commentsByPost.length;
    this.post.totalComments = this.commentsByPost.length;

    this.editPost();
    this.editUser();
  }

  public editPost(): void {
    let editPetition = this.userService
      .editPost(this.post, this.post.id)
      .subscribe({
        next: () => {},
        error: () => {
          alert('there was an error at editUser');
        },
      });

    this.suscriptions.push(editPetition);
  }

  public editUser(): void {
    let editPetition = this.userService
      .editUser(this.user, this.user.id)
      .subscribe({
        next: () => {},
        error: () => {
          alert('there was an error at editUser');
        },
      });

    this.suscriptions.push(editPetition);
  }

  public readUserById(): void {
    let userIdParams = '';

    let bringUserPetition = this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['userId'];
    });

    this.suscriptions.push(bringUserPetition);

    let data = this.userService.users.filter(
      (elem) => elem.id === userIdParams
    );

    this.user = data[0];
  }

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
          this.deleteCommentsByPostId()
          setTimeout(() => {
            this.router.navigate(['/user-page', this.user.id]);
          }, 500);
        },
        error: () => {
          alert('There was an error at deletePostById');
        },
      });

    this.suscriptions.push(deletePetition);
  }

  public deleteCommentsByPostId(): Comment[] {
    let data = this.userService.comments.filter((elem) => {
      if (elem.postId === this.post.id) {
        let deletePetition = this.userService.deleteComment(elem.id).subscribe({
          next: (res) => {},
          error: () => {
            alert('There was an error at deleteCommentById');
          },
        });

        this.suscriptions.push(deletePetition);
      }
    });

    return data;
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

    setTimeout(() => {
      this.getTotalComments();
    }, 1000);

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

  //To update local comments array from this component

  public getCommentsArray(comments: Comment[]): void {
    this.commentsByPost = comments;
    this.getTotalComments();
  }

  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.userService.readAllUsers().subscribe({
      next: (res) => {
        this.userService.users = res;
        this.readUserById();
        console.log('USERS', this.userService.users);
      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });

    this.suscriptions.push(allUsersPetition);
  }

  //Read all posts

  public readAllPosts() {
    let allPostsPetition = this.userService.readAllPosts().subscribe({
      next: (res) => {
        this.userService.posts = res;
        console.log('POSTS', this.userService.posts);
      },
      error: (err) => {
        alert('There was an error un readAllPosts');
      },
    });

    this.suscriptions.push(allPostsPetition);
  }

  //Read all comments

  public readAllComments() {
    let allCommentsPetition = this.userService.readAllComments().subscribe({
      next: (res) => {
        this.userService.comments = res;
        console.log('COMENTARIOS', this.userService.comments);
      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });

    this.suscriptions.push(allCommentsPetition);
  }
}
