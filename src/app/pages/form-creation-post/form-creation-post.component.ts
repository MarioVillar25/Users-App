import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ValidationsService } from '../../services/validations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { getUniqueId, unsubscribePetition } from '../../utils/utils';

@Component({
  selector: 'app-form-creation-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './form-creation-post.component.html',
  styleUrl: './form-creation-post.component.scss',
})
export class FormCreationPostComponent implements OnInit, OnDestroy {
  //* VARIABLES:

  public tags: string[] = [];
  public newTag: string = '';
  public repeatedTag: string = '';
  public error: boolean = false;
  public errorEmpty: boolean = false;
  public errorLength: boolean = false;
  public post?: Post;
  public suscriptions: Subscription[] = [];
  public user!: User;

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

  //* LIFECYCLE HOOKS

  ngOnInit(): void {
    this.readAllComments();
    this.readAllPosts();
    this.readAllUsers();
  }

  ngOnDestroy(): void {
    unsubscribePetition(this.suscriptions);
  }

  //* FUNCTIONS:

  //FUNCIONES PARA CREAR EL POST

  public onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    } else {
      let userIdParams = '';

      let paramsPetition = this.activatedRoute.params.subscribe((params) => {
        userIdParams = params['id'];
      });

      this.suscriptions.push(paramsPetition);

      this.post = {
        id: getUniqueId(3),
        userId: userIdParams,
        title: this.myForm.controls['title'].value,
        description: this.myForm.controls['description'].value,
        tags: this.tags,
        views: 0,
        dateCreation: new Date(),
        image: this.myForm.controls['image'].value,
        totalComments: 0,
      };

      this.createPost(this.post);
      this.tags = [];

      setTimeout(() => {
        this.router.navigate(['/user-page', userIdParams]);
      }, 1000);
    }
  }

  public createPost(post: Post) {
    let createPetition = this.usersService.createPost(post).subscribe({
      next: () => {
        console.log('POST CREADO');
      },
      error: () => {
        alert('There was a problem at createPost');
      },
    });

    this.suscriptions.push(createPetition);
  }

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

  public deleteTag(tag: string): void {
    let datos = this.tags.filter((elem) => elem !== tag);

    this.tags = datos;
  }

  //FUNCIONES PARA VALIDACIONES DEL FORMULARIO

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
