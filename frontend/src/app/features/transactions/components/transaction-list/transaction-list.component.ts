import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TRANSACTION_TYPE_LABELS } from '../../../../models/transaction-type.enum';
import { iconPaths } from '../../../../shared/icons';
import { Category } from '../../../categories/models/category.model';
import { Transaction } from '../../models/transaction.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateAgoPipe } from '../../../../shared/pipes/date-ago.pipe';

@Component({
  selector: 'app-transaction-list',
  imports: [DatePipe, CurrencyFormatPipe, DateAgoPipe],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent {
  readonly transactions = input<Transaction[]>([]);
  readonly categories = input<Category[]>([]);
  readonly edit = output<Transaction>();
  readonly delete = output<Transaction>();

  protected readonly typeLabels = TRANSACTION_TYPE_LABELS;
  protected readonly iconPaths = iconPaths;

  categoryOf(transaction: Transaction): Category | undefined {
    return this.categories().find((c) => c.id === transaction.category);
  }
}
