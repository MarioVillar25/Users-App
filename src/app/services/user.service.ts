import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //* VARIABLES:
  public usersURL: string = 'http://localhost:3000/users';
  public postsURL: string = 'http://localhost:3000/posts';
  public commentsURL: string = 'http://localhost:3000/comments';
  public users: User[] = [];
  public posts: Post[] = [];
  public comments: Comment[] = [];

  //* CONSTRUCTOR:

  constructor(private http: HttpClient) {}

  //* FUNCIONES:

  //-----READ FUNCTIONS-----

  public readAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersURL);
  }

  public readUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.usersURL}/${id}`)
  }

  public readAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsURL);
  }

  public readPostById(id: string): Observable<Post | undefined> {
    return this.http
      .get<Post>(`${this.postsURL}/${id}`)
      .pipe(catchError((err) => of(undefined)));
  }

  public readAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsURL);
  }

  //-----POST FUNCTIONS-----

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersURL, user);
  }

    //-----PUT FUNCTIONS-----

    public editUser(user: User, id: string): Observable<User> {
      return this.http.put<User>(`${this.usersURL}/${id}`, user);
    }


  //-----DELETE FUNCTIONS-----

  public deleteUser(id: number): Observable<User | undefined> {
    return this.http
      .delete<User>(`${this.usersURL}/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  public deletePost(id: number): Observable<User | undefined> {
    return this.http
      .delete<User>(`${this.postsURL}/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }





}
