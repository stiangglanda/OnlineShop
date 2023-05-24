import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "http://localhost:3000/api";

  constructor(private http: HttpClient, private router: Router) { }

  signUp(registerObj: any)
  {
    return this.http.post<any>(`${this.baseUrl}/users/auth`, registerObj);
  }
}
