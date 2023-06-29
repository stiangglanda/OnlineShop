import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { create_article } from '../models/create_article';
import { change_article } from '../models/change_article';

@Injectable({
	providedIn: 'root'
})
export class ArticleService {
	constructor(private http: HttpClient) {}

	private baseUrl: string = 'http://localhost:3000/api';

	getAllArticles() {
		return this.http.get<any>(`${this.baseUrl}/articles`);
	}

	getArticlesID(id: string) {
		return this.http.get<any>(`${this.baseUrl}/articles/` + id);
	}

  createArticle(item: create_article){
    return this.http.post<create_article>(`${this.baseUrl}/articles`, item);
  }

  changeArticle(id: string, item: change_article){
    return this.http.put<change_article>(`${this.baseUrl}/articles/` + id, item);
  }
}
