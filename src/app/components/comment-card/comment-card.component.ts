import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../interfaces/comment.interface';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { unsubscribePetition } from '../../utils/utils';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent implements OnInit {
  //* VARIABLES:

  @Input() comment!: Comment;
  @Input() comments!: Comment[];
  @Output() emisionComments = new EventEmitter<Comment[]>();

  public suscriptions: Subscription[] = [];
  public user?: User;
  public commentState: boolean = false;
  public commentModified: boolean = false;

  //* FORM:

  public editForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required]],
  });

  //*CONSTRUCTOR

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private validationService: ValidationsService
  ) {}

  //* LIFECYCLE HOOKS

  public ngOnInit(): void {
    this.bringUser();
    this.rechargeInputs();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  public bringUser(): void {
    let datos = this.userService.users.filter(
      (elem) => elem.id === this.comment.userId
    );

    this.user = datos[0];
  }

  public deleteCommentById() {
    let deletePetition = this.userService
      .deleteComment(this.comment.id)
      .subscribe({
        next: (res) => {
          console.log('delete Comment by Post Id', res);

          let datos = this.comments.filter((elem) => elem.id !== res.id);
          this.comments = datos;
          this.emisionComments.emit(this.comments);
        },
        error: () => {
          alert('There was an error at deleteCommentById');
        },
      });

    this.suscriptions.push(deletePetition);
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
    let editPetition = this.userService
      .editComment(this.comment, this.comment.id)
      .subscribe({
        next: () => {
          console.log('COMENTARIO MODIFICADO');
          this.commentModified = true;
          this.commentState = false;
        },
        error: (err) => {
          alert('there was an error at editComment');
        },
      });

    this.suscriptions.push(editPetition);
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
