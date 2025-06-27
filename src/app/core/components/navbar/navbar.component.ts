import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, filter, Subject, Subscription, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { UnsubscribeDirective } from '../../../shared/directives/unsubscribe.directive';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, UserCardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent extends UnsubscribeDirective implements OnInit {
  @Output() public onDebounce = new EventEmitter<string>();

  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);

  public searchInputText = '';
  public showSearchArray: boolean = false;
  public route: string = this._router.url;

  public get users() {
    return this._userService.users;
  }

  public ngOnInit(): void {
    this.controlQuickSearchWindow();
    this.readAllUsers();
    this.toEmitDebounce();
    this.route = this._router.url;
  }

  public setSearch() {
    return (this.showSearchArray = !this.showSearchArray);
  }

  public controlQuickSearchWindow(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: () => {
          this.route = this._router.url;
        },
        error: () => {
          alert('there was a problem at controlQuickSearchWindow');
        },
      });
  }

  public onKeyPress(): void {
    this._userService.changeInputValue(this.searchInputText);
  }

  public toEmitDebounce(): void {
    this._userService.searchProtected
      .pipe(debounceTime(300), takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (this._router.url === '/users-list') {
            this.readUsersByQuery(res);
          } else {
            this.readUsersByQuery(res);
          }
        },

        error: () => {
          alert('There was a problem at toEmitDebounce');
        },
      });
  }

  public readUsersByQuery(query: string) {
    if (query === '') {
      this.readAllUsers();
    }

    let data: User[] = [];

    data = this._userService.users.filter(
      (elem) =>
        elem.name.toLowerCase().includes(query.toLowerCase()) ||
        elem.email.toLowerCase().includes(query.toLowerCase())
    );

    this._userService.users = data;
  }

  public readAllUsers() {
    this._userService
      .readAllUsers()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          this._userService.users = res;
        },
        error: (err) => {
          alert('There was an error un readAllUsers');
        },
      });
  }
}
