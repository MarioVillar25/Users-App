import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';
import { SidebarComponent } from '../../../core/components/sidebar/sidebar.component';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  protected readonly usersService = inject(UserService);

  ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
  }

  public readAllUsers() {
    this.usersService.readAllUsers().subscribe({
      next: (res) => {
        this.usersService.updateUsersSubject(res);
        this.usersService.users = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  public readAllPosts() {
    this.usersService.readAllPosts().subscribe({
      next: (res) => {
        this.usersService.posts = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  public readAllComments() {
    this.usersService.readAllComments().subscribe({
      next: (res) => {
        this.usersService.comments = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
