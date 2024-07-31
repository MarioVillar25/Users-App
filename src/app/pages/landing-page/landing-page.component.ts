import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { debounceTime, Subscription } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];

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
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCIONES:


  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.usersService.readAllUsers().subscribe({
      next: (res) => {
        this.usersService.users = res;
        console.log("USERS",this.usersService.users);

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
        console.log("POSTS",this.usersService.posts);

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
        console.log("COMENTARIOS",this.usersService.comments);

      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });

    this.suscriptions.push(allCommentsPetition);
  }






}
