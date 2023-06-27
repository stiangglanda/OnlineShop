import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CategorieService {
	private baseUrl: string = 'http://localhost:3000/api';

	constructor(private http: HttpClient) {}

	getAllCategories() {
		return this.http.get<any>(`${this.baseUrl}/categories`);
	}
}
