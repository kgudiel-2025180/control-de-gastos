import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly storageKey = 'cdg-transactions';
  private readonly _transactions = signal<Transaction[]>(this.load());

  readonly transactions = this._transactions.asReadonly();

  getById(id: string): Transaction | undefined {
    return this._transactions().find((t) => t.id === id);
  }

  add(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    this._transactions.update((list) => [...list, newTransaction]);
    this.save();
  }

  update(id: string, changes: Partial<Transaction>): void {
    this._transactions.update((list) =>
      list.map((t) => (t.id === id ? { ...t, ...changes, id } : t)),
    );
    this.save();
  }

  remove(id: string): void {
    this._transactions.update((list) => list.filter((t) => t.id !== id));
    this.save();
  }

  private load(): Transaction[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as Transaction[];
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._transactions()));
  }
}
