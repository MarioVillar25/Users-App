import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Subscription, switchMap } from 'rxjs';
import { Post } from '../../interfaces/post.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { unsubscribePetition } from '../../utils/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [PostCardComponent, CommonModule],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})
export class PostPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public suscriptions: Subscription[] = [];
  public post?: Post;

  //*CONSTRUCTOR

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  //* LIFECYCLE HOOKS

  ngOnInit(): void {
    this.readPostById();
  }

  ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  public readPostById() {
    let readPostPetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.readPostById(id)))
      .subscribe({
        next: (res) => {
          this.post = res;
          console.log('post', this.post);
        },
        error: (err) => {
          alert('There was a problem at readPostById');
        },
      });

    this.suscriptions.push(readPostPetition);
  }

  public deletePostById() {
    let deletePetition = this.activatedRoute.params
    .pipe(switchMap(({ id }) => this.userService.deletePost(id)))
    .subscribe({
      next: (res) => {
        console.log('delete', res);
        this.router.navigate(['/posts-list']);
      },
      error: () => {
        alert('There was an error at deletePostById');
      },
    });

  this.suscriptions.push(deletePetition);
  }
}
