import { Component } from '@angular/core';
import { PostCardComponent } from "../../../components/post-card/post-card.component";
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { unsubscribePetition } from '../../../core/utils/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts-page',
  standalone: true,
  imports: [PostCardComponent, CommonModule],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss'
})
export class PostsPageComponent {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];

  //* GETTERS:

  public get posts() {
    return this.userService.posts;
  }

  //* CONSTRUCTOR

  constructor(private userService: UserService) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllComments();
    this.readAllPosts();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCIONES:

  public readAllPosts() {
    let allPostsPetition = this.userService.readAllPosts().subscribe({
      next: (res) => {
        this.userService.posts = res;
      },
      error: (err) => {
        alert('There was an error un readAllPosts');
      },
    });

    this.suscriptions.push(allPostsPetition);
  }


  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.userService.readAllUsers().subscribe({
      next: (res) => {
        this.userService.users = res;
        console.log("USERS",this.userService.users);

      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });

    this.suscriptions.push(allUsersPetition);
  }



  //Read all comments

  public readAllComments() {
    let allCommentsPetition = this.userService.readAllComments().subscribe({
      next: (res) => {
        this.userService.comments = res;
        console.log("COMENTARIOS",this.userService.comments);

      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });

    this.suscriptions.push(allCommentsPetition);
  }





}
