import { Component } from '@angular/core';
import { PostCardComponent } from "../../components/post-card/post-card.component";

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss'
})
export class PostPageComponent {

}
