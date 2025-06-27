import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { unsubscribePetition } from '../../../core/utils/utils';
import { UserService } from '../../../core/services/user.service';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { takeUntil } from 'rxjs';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent extends UnsubscribeDirective implements OnInit {
  private readonly userService = inject(UserService);

  users: User[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers() {
    this.userService.users$.pipe(takeUntil(this._destroy$)).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
