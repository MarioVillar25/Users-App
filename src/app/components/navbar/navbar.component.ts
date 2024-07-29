import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, NavigationStart, Route, Router, RouterLink } from '@angular/router';
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
  public route:string = this.router.url

  //* GETTERS:

  public get users() {
    return this.userService.users;
  }

  //* CONSTRUCTOR:

  constructor(private userService: UserService, private router: Router) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.resetSearchInputText();
    this.readAllUsers();
    this.toEmitDebounce();
    this.route = this.router.url


  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCIONES:

  setSearch() {
    return (this.showSearchArray = !this.showSearchArray);
  }

  //Función para que cada vez que cambia la ruta se resetea el valor del input

  public resetSearchInputText(): void {
    let suscripcionURL = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.route = this.router.url
        },
        error: () => {
          alert('there was a problem at resetSearchInputText');
        },
      });

    this.suscriptions.push(suscripcionURL);
  }

  onKeyPress(): void {
    //El Subject va a emitir el valor del input

    this.userService.changeInputValue(this.searchInputText);

  }

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

  public readUsersByQuery(query: string) {
    if (query === '') {
      this.readAllUsers();
    }

    let data: User[] = [];

    data = this.userService.users.filter(
      (elem) =>
        elem.name.toLowerCase().includes(query.toLowerCase()) ||
        elem.username.toLowerCase().includes(query.toLowerCase())
    );

    this.userService.users = data;
  }

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
