import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { user_signup } from '../models/user_signup';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "http://localhost:3000/api";

  constructor(private http: HttpClient, private router: Router) { }

  signUp(registmodel: any)
  {
    return this.http.post<any>(`${this.baseUrl}/users/register`, registmodel);
  }

  login (loginmodel: any)
  {
    return this.http.post<any>(`${this.baseUrl}/users/login`, loginmodel);
  }

  storeToken(tokenValue: string)
  {
    sessionStorage.setItem('token', tokenValue);
  }

  getToken()
  {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean
  {
    return !!sessionStorage.getItem('token');
  }

  signOut()
  {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  decodedToken()
  {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }
}
