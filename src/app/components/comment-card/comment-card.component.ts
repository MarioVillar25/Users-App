import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../interfaces/comment.interface';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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
  public user!: User;
  public commentState: boolean = false;
  public commentModified: boolean = false;
  public route = this.router.url;

  //* FORM:

  public editForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required]],
  });

  //*CONSTRUCTOR

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private validationService: ValidationsService,
    private router: Router
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

  //To bring user info

  public bringUser(): void {
    let datos = this.userService.users.filter(
      (elem) => elem.id === this.comment.userId
    );

    this.user = datos[0];
  }

  //To delete comment by ID

  public deleteCommentById() {
    let deletePetition = this.userService
      .deleteComment(this.comment.id)
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

    this.suscriptions.push(deletePetition);
  }

  //To edit comment by ID

  public editCommentById(): void {
    this.commentState = !this.commentState;
  }

  //To submit button form

  public onEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
    } else {
      this.comment.text = this.editForm.controls['comment'].value;

      this.editComment();
    }
  }

  //To edit comment action

  public editComment() {
    let editPetition = this.userService
      .editComment(this.comment, this.comment.id)
      .subscribe({
        next: () => {
          this.commentModified = true;
          this.commentState = false;
        },
        error: (err) => {
          alert('there was an error at editComment');
        },
      });

    this.suscriptions.push(editPetition);
  }

  //To recharge form inputs

  public rechargeInputs() {
    this.editForm.patchValue({
      comment: this.comment.text,
    });
  }

  //To validate form field

  public isValidField(field: string, error: string) {
    return this.validationService.isValidField(this.editForm, field, error);
  }
}
