import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ValidationsService } from '../../services/validations.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap } from 'rxjs';
import { unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-form-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form-edit-post.component.html',
  styleUrl: './form-edit-post.component.scss',
})
export class FormEditPostComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public tags: string[] = [];
  public newTag: string = '';
  public repeatedTag: string = '';
  public error: boolean = false;
  public errorEmpty: boolean = false;
  public errorLength: boolean = false;
  public post!: Post;
  public suscriptions: Subscription[] = [];

  //* FORM:

  public myForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    image: [''],
  });

  //* CONSTRUCTOR:

  constructor(
    private usersService: UserService,
    private validationsService: ValidationsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  //* LIFE CYCLEHOOKS

  public ngOnInit(): void {
    this.readAllUsers();
    this.readAllPosts();
    this.readAllComments();
    this.rechargeInputs();
  }

  public ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  //To back to the previous page

  public backToUserPage(): void {
    let userIdParams = '';
    let postIdParams = '';

    let bringUserPetition = this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['userId'];
    });

    let bringPostPetition = this.activatedRoute.params.subscribe((params) => {
      userIdParams = params['postId'];
    });

    this.suscriptions.push(bringUserPetition, bringPostPetition);

    this.router.navigate([
      'user-page',
      postIdParams,
      'post-page',
      userIdParams,
    ]);
  }

  //To recharge Inputs when component is created

  public rechargeInputs() {
    let readByIdPetition = this.activatedRoute.params
      .pipe(switchMap(({ postId }) => this.usersService.readPostById(postId)))
      .subscribe({
        next: (res) => {
          this.post = res;
          this.tags = res.tags;
          this.myForm.patchValue({
            title: this.post.title,
            description: this.post.description,
            image: this.post.image,
          });
        },
        error: (err) => {
          alert('There was a problem at rechargeInputs');
        },
      });

    this.suscriptions.push(readByIdPetition);
  }

  //To Submit button from Form

  public onEdit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      this.post.title = this.myForm.controls['title'].value;
      this.post.description = this.myForm.controls['description'].value;
      this.post.tags = this.tags;
      this.post.image = this.myForm.controls['image'].value;

      this.editPost();
    }
  }

  //To edit Post

  public editPost() {
    let editPetition = this.usersService
      .editPost(this.post, this.post.id)
      .subscribe({
        next: () => {
          this.router.navigate(['posts-list']);
        },
        error: (err) => {
          alert('there was an error at editPost');
        },
      });

    this.suscriptions.push(editPetition);
  }

  //To add a new tag

  public addTag(): void {
    if (this.tags.length <= 5) {
      this.errorLength = false;
    }

    if (this.newTag === '' && this.tags.length !== 5) {
      this.errorEmpty = true;
    } else {
      this.errorEmpty = false;

      let datos = this.tags.filter((elem) => elem === this.newTag);

      if (datos.length === 1) {
        this.error = true;
        this.repeatedTag = this.newTag;
        this.newTag = '';
      } else {
        this.error = false;

        if (this.tags.length < 5) {
          this.tags.push(this.newTag);
          this.newTag = '';
        } else {
          this.errorLength = true;
        }
      }
    }
  }

  //To delete a tag

  public deleteTag(tag: string): void {
    let datos = this.tags.filter((elem) => elem !== tag);
    this.tags = datos;
  }

  //To check if a field is valid

  public isValidField(field: string, error: string) {
    return this.validationsService.isValidField(this.myForm, field, error);
  }

  //Read all users

  public readAllUsers() {
    let allUsersPetition = this.usersService.readAllUsers().subscribe({
      next: (res) => {
        this.usersService.users = res;
        console.log('USERS', this.usersService.users);
      },
      error: (err) => {
        alert('There was an error un readAllUsers');
      },
    });

    this.suscriptions.push(allUsersPetition);
  }

  //Read all posts

  public readAllPosts() {
    let allPostsPetition = this.usersService.readAllPosts().subscribe({
      next: (res) => {
        this.usersService.posts = res;
        console.log('POSTS', this.usersService.posts);
      },
      error: (err) => {
        alert('There was an error un readAllPosts');
      },
    });

    this.suscriptions.push(allPostsPetition);
  }

  //Read all comments

  public readAllComments() {
    let allCommentsPetition = this.usersService.readAllComments().subscribe({
      next: (res) => {
        this.usersService.comments = res;
        console.log('COMENTARIOS', this.usersService.comments);
      },
      error: (err) => {
        alert('There was an error un readAllComments');
      },
    });

    this.suscriptions.push(allCommentsPetition);
  }
}
