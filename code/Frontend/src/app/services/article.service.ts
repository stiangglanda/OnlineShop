import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

constructor(private http : HttpClient) { }

  private baseUrl: string = "http://localhost:3000/api";

  getAllArticles()
  {
    return this.http.get<any>(`${this.baseUrl}/articles`);
  }

  getArticlesID(id : string)
  {
    return this.http.get<any>(`${this.baseUrl}/articles/` + id);
  }

}
