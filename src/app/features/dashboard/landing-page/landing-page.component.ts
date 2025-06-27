import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../core/interfaces/user.interface';
import { Post } from '../../../core/interfaces/post.interface';
import { UserService } from '../../../core/services/user.service';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';
import { Comment } from '../../../core/interfaces/comment.interface';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [UserCardComponent, PostCardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent
  extends UnsubscribeDirective
  implements OnInit
{
  protected readonly usersService = inject(UserService);

  userWhoCommentedMost: User[] = [];
  usersWhoPostedMore: User[] = [];
  mostCommentedPost: Post[] = [];

  users: User[] = this.usersService.users;
  comments: Comment[] = this.usersService.comments;
  posts: Post[] = this.usersService.posts;

  public ngOnInit(): void {
    setTimeout(() => {
      this.GetUserWhoCommentedMost();
      this.GetMostCommentedPost();
      this.GetUsersWhoPostedMore();
    }, 100);
  }

  public GetUserWhoCommentedMost(): void {
    let dataSorted = this.usersService.users.sort(
      (a, b) => b.totalComments - a.totalComments
    );

    let data = dataSorted.slice(0, 1);

    this.userWhoCommentedMost = data;
  }

  public GetMostCommentedPost(): void {
    let dataSorted = this.usersService.posts.sort(
      (a, b) => b.totalComments - a.totalComments
    );

    let data = dataSorted.slice(0, 2);

    this.mostCommentedPost = data;
  }

  public GetUsersWhoPostedMore(): void {
    let dataSorted = this.usersService.users.sort(
      (a, b) => b.totalPosts - a.totalPosts
    );

    let data = dataSorted.slice(0, 3);

    this.usersWhoPostedMore = data;
  }
}
