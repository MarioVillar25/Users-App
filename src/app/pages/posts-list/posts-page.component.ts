import { Component } from '@angular/core';
import { PostCardComponent } from "../../components/post-card/post-card.component";
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';
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

}
