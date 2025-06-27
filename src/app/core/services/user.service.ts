import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient)

  public usersURL: string = 'http://localhost:3000/users';
  public postsURL: string = 'http://localhost:3000/posts';
  public commentsURL: string = 'http://localhost:3000/comments';
  public users: User[] = [];
  public posts: Post[] = [];
  public comments: Comment[] = [];

  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public posts$ = this.postsSubject.asObservable();

  private commentsSubject: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  public comments$ = this.commentsSubject.asObservable();

  private searchInputValue: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public searchProtected = this.searchInputValue.asObservable();

  //-----OBSERVABLES-----

  public changeInputValue(value: string) {
    this.searchInputValue.next(value);
  }

  public updateUsersSubject(users: User[]){
    this.usersSubject.next(users);
  }

  //-----GET-----

  public readAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersURL);
  }

  public readUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersURL}/${id}`);
  }

  public readAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsURL);
  }

  public readPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsURL}/${id}`);
  }

  public readAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsURL);
  }

  //-----POST-----

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersURL, user);
  }

  public createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.postsURL, post);
  }

  public createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentsURL, comment);
  }

  //-----PUT-----

  public editUser(user: User, id: string): Observable<User> {
    return this.http.put<User>(`${this.usersURL}/${id}`, user);
  }

  public editPost(post: Post, id: string): Observable<Post> {
    return this.http.put<Post>(`${this.postsURL}/${id}`, post);
  }

  public editComment(comment: Comment, id: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.commentsURL}/${id}`, comment);
  }

  //-----DELETE-----

  public deleteUser(id: string): Observable<User | undefined> {
    return this.http
      .delete<User>(`${this.usersURL}/${id}`)
  }

  public deletePost(id: string): Observable<User | undefined> {
    return this.http
      .delete<User>(`${this.postsURL}/${id}`)
  }

  public deleteComment(id: string): Observable<Comment> {
    return this.http.delete<Comment>(`${this.commentsURL}/${id}`);
  }
}
