import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //* VARIABLES:
  //* GETTERS:
  //* CONSTRUCTOR:

  constructor(private http: HttpClient) {}
  //* LIFECYCLE HOOKS

  //* FUNCIONES:

  public readAllComments(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/comments');
  }
}
