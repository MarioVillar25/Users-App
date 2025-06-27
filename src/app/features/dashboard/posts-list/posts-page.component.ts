import { Component, inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { UserService } from '../../../core/services/user.service';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';
import { Post } from '../../../core/interfaces/post.interface';

@Component({
  selector: 'app-posts-page',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
})
export class PostsPageComponent extends UnsubscribeDirective {
  private readonly userService = inject(UserService);

  posts: Post[] = this.userService.posts
}
