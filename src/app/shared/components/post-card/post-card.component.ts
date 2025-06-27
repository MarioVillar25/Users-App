import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Post } from '../../../core/interfaces/post.interface';
import { User } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  private readonly userService = inject(UserService)

  @Input() public post!: Post;

  public user?: User;

  public ngOnInit(): void {
    this.getUser();
  }

  public getUser(): void {
    let datos = this.userService.users.filter(
      (elem) => elem.id === this.post.userId
    );

    this.user = datos[0];
  }
}
