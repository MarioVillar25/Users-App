import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {

  @Input() public post!: Post;

}
