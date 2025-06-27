import { Component, inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { UserService } from '../../../core/services/user.service';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

@Component({
  selector: 'app-posts-page',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
})
export class PostsPageComponent extends UnsubscribeDirective implements OnInit {
  protected readonly userService = inject(UserService);

  public get posts() {
    return this.userService.posts;
  }

  public ngOnInit(): void {
    this.readAllPosts();
  }

  public readAllPosts() {
    this.userService
      .readAllPosts()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this.userService.posts = res;
        },
        error: (err) => {
          alert('There was an error un readAllPosts');
        },
      });
  }
}
