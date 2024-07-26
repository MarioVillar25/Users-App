import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CommonModule } from '@angular/common';
import { unsubscribePetition } from '../../utils/utils';
import { Subscription, switchMap } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [PostCardComponent, CommonModule, RouterLink],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit, OnDestroy {
  //* VARIABLES:
  public suscriptions: Subscription[] = [];
  public user?: User;

  //* CONSTRUCTOR:

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  //* LIFECYCLE HOOKS
  public ngOnInit(): void {
    this.readUserById();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:
  public readUserById() {
    let readByIdPetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.readUserById(id)))
      .subscribe({
        next: (res) => {
          this.user = res;
          console.log('user', this.user);
        },
        error: (err) => {
          alert('There was a problem at readUserById');
        },
      });

      this.suscriptions.push(readByIdPetition);
  }

  public deleteUserById() {
    let deletePetition = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.deleteUser(id)))
      .subscribe({
        next: (res) => {
          console.log('delete', res);
          this.router.navigate(['/users-list']);
        },
        error: () => {
          alert('There was an error at deleteUserById');
        },
      });

    this.suscriptions.push(deletePetition);
  }
}
