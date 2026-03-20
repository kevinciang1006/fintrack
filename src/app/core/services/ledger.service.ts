import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LedgerService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  addTransaction(t: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, t);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
