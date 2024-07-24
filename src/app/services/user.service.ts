import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Post } from '../interfaces/post.interface';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //* VARIABLES:

  public users: User[] = [];
  public posts: Post[] = [];
  public comments: Comment[] = [];

  //* CONSTRUCTOR:

  constructor(private http: HttpClient) {}

  //* FUNCIONES:

  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  //-----READ FUNCTIONS-----

  public readAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/users');
  }

  public readAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:3000/posts');
  }

  public readAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>('http://localhost:3000/comments');
  }

  //-----POST FUNCTIONS-----

  public createUser(user: User): Observable<User>{
    return this.http.post<User>('http://localhost:3000/users', user );
  }
}
