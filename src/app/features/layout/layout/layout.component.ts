import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../core/components/navbar/navbar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements AfterViewInit {

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
