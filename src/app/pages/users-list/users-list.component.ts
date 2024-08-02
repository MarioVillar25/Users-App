import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserCardComponent, CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];

  //* GETTERS:

  public get users() {
    return this.userService.users;
  }

  //* CONSTRUCTOR

  constructor(private userService: UserService) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.readAllPosts();
    this.readAllComments();
    this.readAllUsers();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCIONES:

  public readAllUsers() {
    let allUsersPetition = this.userService.readAllUsers().subscribe({
      next: (res) => {
        this.userService.users = res;
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
