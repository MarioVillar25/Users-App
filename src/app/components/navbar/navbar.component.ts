import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { debounceTime, filter, Subject, Subscription } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, UserCardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  @Output() public onDebounce = new EventEmitter<string>();

  public searchInputText = '';
  public suscriptions: Subscription[] = [];
  public showSearchArray: boolean = false;
  public route: string = this.router.url;

  //* GETTERS:

  public get users() {
    return this.userService.users;
  }

  //* CONSTRUCTOR:

  constructor(private userService: UserService, private router: Router) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.controlQuickSearchWindow();
    this.readAllUsers();
    this.toEmitDebounce();
    this.route = this.router.url;
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  //To show quick search window

  public setSearch() {
    return (this.showSearchArray = !this.showSearchArray);
  }

  //To control quick search window depending on the route

  public controlQuickSearchWindow(): void {
    let suscripcionURL = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.route = this.router.url;
        },
        error: () => {
          alert('there was a problem at controlQuickSearchWindow');
        },
      });

    this.suscriptions.push(suscripcionURL);
  }

  //To send Input Value on key press

  public onKeyPress(): void {
    this.userService.changeInputValue(this.searchInputText);
  }

  //To emit debounce function on searchBox

  public toEmitDebounce(): void {
    let debouncePetition = this.userService.searchProtected
      .pipe(debounceTime(300))
      .subscribe({
        next: (res) => {
          if (this.router.url === '/users-list') {
            this.readUsersByQuery(res);
          } else {
            this.readUsersByQuery(res);
          }
        },

        error: () => {
          alert('There was a problem at toEmitDebounce');
        },
      });

    this.suscriptions.push(debouncePetition);
  }

  //To read users by query

  public readUsersByQuery(query: string) {
    if (query === '') {
      this.readAllUsers();
    }

    let data: User[] = [];

    data = this.userService.users.filter(
      (elem) =>
        elem.name.toLowerCase().includes(query.toLowerCase()) ||
        elem.email.toLowerCase().includes(query.toLowerCase())
    );

    this.userService.users = data;
  }

  //To read all users

  public readAllUsers() {
    let allUsersPetition = this.userService.readAllUsers().subscribe({
      next: (res) => {
        this.userService.users = res;
      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });

    this.suscriptions.push(allUsersPetition);
  }
}
