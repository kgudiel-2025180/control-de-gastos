import { Component, computed, inject, signal } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { TransactionFilterComponent, TransactionFilterCriteria, EMPTY_CRITERIA } from '../../components/transaction-filter/transaction-filter.component';
import { TransactionListComponent } from '../../components/transaction-list/transaction-list.component';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../../categories/services/category.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-transactions-page',
  imports: [
    ModalComponent,
    ConfirmDialogComponent,
    TransactionFormComponent,
    TransactionFilterComponent,
    TransactionListComponent,
    CurrencyFormatPipe,
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css',
})
export class TransactionsPageComponent {
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);

  readonly transactions = this.transactionService.transactions;
  readonly categories = this.categoryService.categories;

  protected readonly criteria = signal<TransactionFilterCriteria>(EMPTY_CRITERIA);
  protected readonly formOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly pendingDelete = signal<Transaction | null>(null);

  protected readonly editingTransaction = computed(() => {
    const id = this.editingId();
    return id ? this.transactionService.getById(id) ?? null : null;
  });

  protected readonly filteredTransactions = computed(() => {
    const criteria = this.criteria();
    return this.transactions()
      .filter((t) => {
        if (criteria.type !== 'ALL' && t.type !== criteria.type) {
          return false;
        }
        if (criteria.categoryId && t.category !== criteria.categoryId) {
          return false;
        }
        if (criteria.from && t.date < new Date(`${criteria.from}T00:00:00`).toISOString()) {
          return false;
        }
        if (criteria.to && t.date > new Date(`${criteria.to}T23:59:59`).toISOString()) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  protected readonly totals = computed(() => {
    const income = this.transactions()
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = this.transactions()
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  });

  onCriteriaChange(criteria: TransactionFilterCriteria): void {
    this.criteria.set(criteria);
  }

  onOpenCreate(): void {
    this.editingId.set(null);
    this.formOpen.set(true);
  }

  onOpenEdit(transaction: Transaction): void {
    this.editingId.set(transaction.id);
    this.formOpen.set(true);
  }

  onCloseForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
  }

  onSubmitted(data: Omit<Transaction, 'id'>): void {
    const id = this.editingId();
    if (id) {
      this.transactionService.update(id, data);
    } else {
      this.transactionService.add(data);
    }
    this.onCloseForm();
  }

  onAskDelete(transaction: Transaction): void {
    this.pendingDelete.set(transaction);
  }

  onDeleteConfirmed(): void {
    const pending = this.pendingDelete();
    if (pending) {
      this.transactionService.remove(pending.id);
    }
    this.pendingDelete.set(null);
  }

  onDeleteCancelled(): void {
    this.pendingDelete.set(null);
  }
}
