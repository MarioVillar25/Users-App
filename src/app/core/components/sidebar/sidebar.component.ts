import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('btn') btn!: ElementRef;
  @ViewChild('btn2') btn2!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;

  ngAfterViewInit(): void {
    this.btn.nativeElement.addEventListener('click', () => {
      this.sidebar.nativeElement.classList.toggle('active');
    });

    this.btn2.nativeElement.addEventListener('click', () => {
      this.sidebar.nativeElement.classList.toggle('active');
    });
  }
}
