import { Component } from '@angular/core';
import { PostCardComponent } from "../../components/post-card/post-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [PostCardComponent, CommonModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {

}
