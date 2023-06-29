import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { name_update } from '../models/name_update';
import { adress_update } from '../models/adress_update';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private baseUrl: string = 'http://localhost:3000/api';

	constructor(private http: HttpClient) {}

	getUserByName(username: string) {
		return this.http.get<any>(`${this.baseUrl}/users/${username}`);
	}

	updateUserFullName(username: string, model: name_update) {
		return this.http.put<name_update>(`${this.baseUrl}/users/${username}`, model);
	}

	updateUserAdress(username: string, model: adress_update) {
		return this.http.put<adress_update>(`${this.baseUrl}/users/${username}`, model);
	}

	getListingByName(username: string) {
		return this.http.get<any>(`${this.baseUrl}/users/${username}/listings`);
	}

	updateUserBalance(username: string, balance: any) {
		return this.http.put<any>(`${this.baseUrl}/users/${username}`, balance);
	}
}
