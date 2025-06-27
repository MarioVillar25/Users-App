import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { unsubscribePetition } from '../../../core/utils/utils';
import { UserService } from '../../../core/services/user.service';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { takeUntil } from 'rxjs';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent extends UnsubscribeDirective implements OnInit {
  protected readonly userService = inject(UserService);

  public get users() {
    return this.userService.users;
  }

  public ngOnInit(): void {
    this.readAllUsers();
  }

  public readAllUsers() {
    this.userService
      .readAllUsers()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this.userService.users = res;
        },
        error: (err) => {
          alert('There was an error un readAllUsers');
        },
      });
  }
}
