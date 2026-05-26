import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { MOCK_TRANSACTIONS } from '../data/mock-transactions';

@Injectable({ providedIn: 'root' })
export class LedgerService {
  private readonly _transactions = signal<Transaction[]>([...MOCK_TRANSACTIONS]);

  getTransactions(): Observable<Transaction[]> {
    return of([...this._transactions()]);
  }

  addTransaction(t: Omit<Transaction, 'id'>): Observable<Transaction> {
    const added: Transaction = { ...t, id: crypto.randomUUID() };
    this._transactions.update(txns => [added, ...txns]);
    return of(added);
  }

  deleteTransaction(id: string): Observable<void> {
    this._transactions.update(txns => txns.filter(t => t.id !== id));
    return of(undefined);
  }
}
