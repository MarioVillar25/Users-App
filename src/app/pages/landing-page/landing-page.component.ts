import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { debounceTime, Subscription, filter } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';
import { User } from '../../interfaces/user.interface';
import { Post } from '../../interfaces/post.interface';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, UserCardComponent, PostCardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];
  public userWhoCommentedMost: User[] = [];
  public usersWhoPostedMore: User[] = [];
  public mostCommentedPost: Post[] = [];

  //* GETTERS:

  public get comments() {
    return this.usersService.comments;
  }

  public get posts() {
    return this.usersService.posts;
  }

  public get users() {
    return this.usersService.users;
  }

  //* CONSTRUCTOR:

  constructor(private usersService: UserService) {}
  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    setTimeout(() => {
      this.GetUserWhoCommentedMost();
      this.GetMostCommentedPost();
      this.GetUsersWhoPostedMore();
    }, 500);
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCIONES:

  public GetUserWhoCommentedMost(): void {
    let data = this.usersService.users.reduce((max, elem) =>
      elem.totalComments > max.totalComments ? elem : max
    );

    this.userWhoCommentedMost.push(data);
  }

  public GetMostCommentedPost(): void {
    let data = this.usersService.posts.reduce((max, elem) =>
      elem.totalComments > max.totalComments ? elem : max
    );

    this.mostCommentedPost.push(data);
  }

  public GetUsersWhoPostedMore(): void {
    let dataSorted = this.usersService.users.sort(
      (a, b) => b.totalPosts - a.totalPosts
    );

    let data = dataSorted.slice(0, 3);

    this.usersWhoPostedMore = data;
  }

  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.usersService.readAllUsers().subscribe({
      next: (res) => {
        this.usersService.users = res;
        console.log('USERS', this.usersService.users);
      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });

    this.suscriptions.push(allUsersPetition);
  }

  //Read all posts

  public readAllPosts() {
    let allPostsPetition = this.usersService.readAllPosts().subscribe({
      next: (res) => {
        this.usersService.posts = res;
        console.log('POSTS', this.usersService.posts);
      },
      error: (err) => {
        alert('There was an error un readAllPosts');
      },
    });

    this.suscriptions.push(allPostsPetition);
  }

  //Read all comments

  public readAllComments() {
    let allCommentsPetition = this.usersService.readAllComments().subscribe({
      next: (res) => {
        this.usersService.comments = res;
        console.log('COMENTARIOS', this.usersService.comments);
      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });

    this.suscriptions.push(allCommentsPetition);
  }
}
