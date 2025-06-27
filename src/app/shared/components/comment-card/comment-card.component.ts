import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnsubscribeDirective } from '../../directives/unsubscribe.directive';
import { User } from '../../../core/interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { ValidationsService } from '../../../core/services/validations.service';
import { Comment } from '../../../core/interfaces/comment.interface';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent extends UnsubscribeDirective implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly validationService = inject(ValidationsService);
  private readonly router = inject(Router);

  @Input() comment!: Comment;
  @Input() comments!: Comment[];
  @Output() emisionComments = new EventEmitter<Comment[]>();

   user!: User;
   commentState: boolean = false;
   commentModified: boolean = false;
   route = this.router.url;

   editForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required]],
  });

  public ngOnInit(): void {
    this.bringUser();
    this.rechargeInputs();
  }

  public bringUser(): void {
    let datos = this.userService.users.filter(
      (elem) => elem.id === this.comment.userId
    );

    this.user = datos[0];
  }


  public deleteCommentById() {
     this.userService
      .deleteComment(this.comment.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          let datos = this.comments.filter((elem) => elem.id !== res.id);
          this.comments = datos;
          this.emisionComments.emit(this.comments);
        },
        error: () => {
          alert('There was an error at deleteCommentById');
        },
      });

  }

  public editCommentById(): void {
    this.commentState = !this.commentState;
  }

  public onEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
    } else {
      this.comment.text = this.editForm.controls['comment'].value;

      this.editComment();
    }
  }

  public editComment() {
     this.userService
      .editComment(this.comment, this.comment.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.commentModified = true;
          this.commentState = false;
        },
        error: (err) => {
          alert('there was an error at editComment');
        },
      });

  }

  public rechargeInputs() {
    this.editForm.patchValue({
      comment: this.comment.text,
    });
  }

  public isValidField(field: string, error: string) {
    return this.validationService.isValidField(this.editForm, field, error);
  }
}
