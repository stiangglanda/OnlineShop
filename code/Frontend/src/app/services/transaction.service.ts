import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private baseUrl: string = 'http://localhost:3000/api';

	constructor(private http: HttpClient) {}

  getSellerTransaction(username: string)
  {
    return this.http.get<any>(`${this.baseUrl}/transactions/seller/` + username);
  }

  getBuyerTransaction(username: string)
  {
    return this.http.get<any>(`${this.baseUrl}/transactions/buyer/` + username);
  }

	createTransaction(body: any) {
		return this.http.post<any>(`${this.baseUrl}/transactions`, body);
	}

}
