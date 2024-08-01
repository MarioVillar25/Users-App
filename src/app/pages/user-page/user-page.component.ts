import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CommonModule } from '@angular/common';
import { unsubscribePetition } from '../../utils/utils';
import { Subscription, switchMap } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { Comment } from '../../interfaces/comment.interface';
import { CommentCardComponent } from '../../components/comment-card/comment-card.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [PostCardComponent, CommonModule, RouterLink, CommentCardComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:
  public suscriptions: Subscription[] = [];
  public user!: User;
  public userPosts: Post[] = [];
  public userComments: Comment[] = [];

  //* CONSTRUCTOR:

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  //* LIFECYCLE HOOKS
  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    this.readUserById();
    setTimeout(() => {
      this.getTotalPosts();
    }, 500);
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  //FUNCIONES PARA SUMAR EL TOTAL POST

  public getTotalPosts(): void {
    //First: Read User By Id
    let userIdParams = '';

    let bringUserPetition = this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['id'];
    });

    this.suscriptions.push(bringUserPetition);

    let dataUser = this.userService.users.filter(
      (elem) => elem.id === userIdParams
    );

    this.user = dataUser[0];

    //Second: Bring all posts from that User ID

    let dataPosts = this.userService.posts.filter(
      (elem) => elem.userId === userIdParams
    );

    //Third: Asign value to totalPost

    this.user.totalPosts = dataPosts.length;

    //Last: PUT
    this.editUser();
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

  //-----------------

  public readCommentsByUserId() {
    let userIdParams = '';

    let paramsUserPetition = this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['id'];
    });

    let readPetition = this.userService.readAllComments().subscribe({
      next: (res) => {
        let data = res.filter((elem) => elem.userId === userIdParams);
        this.userComments = data;
      },
      error: (err) => {
        alert('There was a problem at readCommentsByUserId');
      },
    });

    this.suscriptions.push(paramsUserPetition, readPetition);
  }

  public readUserPosts(): void {
    let data = this.userService.posts.filter(
      (elem) => elem.userId === this.user.id
    );

    this.userPosts = data;
  }

  public readUserById() {
    let readByIdPetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.readUserById(id)))
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

    this.suscriptions.push(readByIdPetition);
  }

  public deletePostsByUserId(): Post[] {
    let data = this.userService.posts.filter((elem) => {
      if (elem.userId === this.user.id) {
        let deletePetition = this.userService.deletePost(elem.id).subscribe({
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

  public deleteCommentsByUserId(): Comment[] {
    let data = this.userService.comments.filter((elem) => {
      if (elem.userId === this.user.id) {
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

  public deleteUserById() {
    let deletePetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.deleteUser(id)))
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

    this.suscriptions.push(deletePetition);
  }

  public getCommentsArray(comments: Comment[]) {
    return (this.userComments = comments);
  }

  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.userService.readAllUsers().subscribe({
      next: (res) => {
        this.userService.users = res;
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
