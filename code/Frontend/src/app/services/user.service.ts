import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "http://localhost:3000/api";

  constructor(private http: HttpClient) { }

  getUserByName(username: string)
  {
    return this.http.get<any>(`${this.baseUrl}/users/${username}`);
  }

  updateUserByName(username: string, model: any)
  {
    return this.http.put<any>(`${this.baseUrl}/users/${username}`, model);
  }
}
