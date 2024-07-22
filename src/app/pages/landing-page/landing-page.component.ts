import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  //* VARIABLES:
  //* GETTERS:
  //* CONSTRUCTOR:

  constructor(private usersService: UserService) {}
  //* LIFECYCLE HOOKS

  //* FUNCIONES:

  public readAllComments() {
    this.usersService.readAllComments().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });
  }
}
