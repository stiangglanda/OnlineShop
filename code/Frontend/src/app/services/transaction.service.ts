import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl: string = 'http://localhost:3000/api';

constructor(private http: HttpClient) { }

  createTransaction(body: any)
  {
    return this.http.post<any>(`${this.baseUrl}/transactions`, body);
  }

}
