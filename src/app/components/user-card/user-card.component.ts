import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  @Input() public user!: User;


  //* CONSTRUCTOR:

  constructor(private usersService: UserService) {}

  //* LIFECYCLE HOOKS

  ngOnDestroy(): void {}

  ngOnInit(): void {

  }
  //* FUNCTIONS:







}
