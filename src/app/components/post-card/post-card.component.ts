import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  //* VARIABLES:

  @Input() public post!: Post;

  public user?: User;

  //* CONSTRUCTOR:

  constructor(private userService: UserService) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.bringUser();
  }

  //* FUNCTIONS:

  //To bring user info

  public bringUser(): void {
    let datos = this.userService.users.filter(
      (elem) => elem.id === this.post.userId
    );

    this.user = datos[0];
  }
}
