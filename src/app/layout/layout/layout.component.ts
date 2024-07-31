import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Subscription } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  //* VARIABLES:

  @ViewChild('btn') btn!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;

  public suscriptions: Subscription[] = [];

  //* CONSTRUCTOR:

  constructor(private usersService: UserService) {}

  //* LIFECYCLE HOOKS

  ngOnInit(): void {



  }

  ngAfterViewInit(): void {
    this.btn.nativeElement.addEventListener('click', () => {
      this.sidebar.nativeElement.classList.toggle('active');
    });
  }

  ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:



}
